import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  order_id: string;
  amount: number;
  currency: string;
  card_data: {
    card_number: string;
    cardholder_name: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
  };
}

interface PaymentGatewayResponse {
  success: boolean;
  transaction_id?: string;
  error_message?: string;
  gateway_response?: Record<string, unknown>;
}

/**
 * Mock Payment Gateway Integration - بوابة الدفع التجريبية
 * Replace this with actual payment gateway that supports Mada:
 * - PayTabs (Saudi-based, full Mada support)
 * - Moyasar (Saudi-based, Mada support)
 * - HyperPay (Middle East, Mada support)
 * - Stripe (International, limited Mada support)
 */
async function processPaymentWithGateway(
  amount: number,
  currency: string,
  cardData: PaymentRequest['card_data']
): Promise<PaymentGatewayResponse> {
  // This is a MOCK implementation for demonstration - هذا تطبيق تجريبي
  // In production, replace with actual payment gateway API calls
  // For Mada cards, ensure gateway supports Saudi payment network
  
  console.log('Processing payment:', { amount, currency, cardholder: cardData.cardholder_name });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation: reject if card number starts with '0000'
  if (cardData.card_number.startsWith('0000')) {
    return {
      success: false,
      error_message: 'رقم البطاقة غير صحيح',
    };
  }
  
  // Mock validation: reject if amount is exactly 999.99 (for testing)
  if (amount === 999.99) {
    return {
      success: false,
      error_message: 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى',
    };
  }
  
  // Mock success response
  return {
    success: true,
    transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    gateway_response: {
      status: 'approved',
      approval_code: 'MOCK123',
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Detect card type from card number
 */
function detectCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  
  return 'unknown';
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const paymentRequest: PaymentRequest = await req.json();
    
    // Validate request
    if (!paymentRequest.order_id || !paymentRequest.amount || !paymentRequest.card_data) {
      return new Response(
        JSON.stringify({ error: 'بيانات الطلب غير مكتملة' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify order exists
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .eq('id', paymentRequest.order_id)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'الطلب غير موجود' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify amount matches
    if (Math.abs(order.total_amount - paymentRequest.amount) > 0.01) {
      return new Response(
        JSON.stringify({ error: 'المبلغ غير متطابق' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Detect card type
    const cardType = detectCardType(paymentRequest.card_data.card_number);
    const cardLastFour = paymentRequest.card_data.card_number.slice(-4);

    // Create payment transaction record (pending)
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        order_id: paymentRequest.order_id,
        payment_method: 'card',
        card_type: cardType,
        card_last_four: cardLastFour,
        cardholder_name: paymentRequest.card_data.cardholder_name,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        status: 'pending',
      })
      .select()
      .single();

    if (transactionError || !transaction) {
      console.error('Error creating transaction:', transactionError);
      return new Response(
        JSON.stringify({ error: 'فشل في إنشاء سجل الدفع' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Process payment with gateway
    const gatewayResult = await processPaymentWithGateway(
      paymentRequest.amount,
      paymentRequest.currency,
      paymentRequest.card_data
    );

    // Update transaction with result
    const updateData: Record<string, unknown> = {
      status: gatewayResult.success ? 'completed' : 'failed',
      processed_at: new Date().toISOString(),
    };

    if (gatewayResult.success) {
      updateData.transaction_id = gatewayResult.transaction_id;
      updateData.gateway_response = gatewayResult.gateway_response;
    } else {
      updateData.error_message = gatewayResult.error_message;
    }

    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
    }

    // Update order status if payment successful
    if (gatewayResult.success) {
      await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          payment_method: 'card',
        })
        .eq('id', paymentRequest.order_id);
    }

    // Return result
    return new Response(
      JSON.stringify({
        success: gatewayResult.success,
        transaction_id: transaction.id,
        gateway_transaction_id: gatewayResult.transaction_id,
        error_message: gatewayResult.error_message,
      }),
      { 
        status: gatewayResult.success ? 200 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'حدث خطأ أثناء معالجة الدفع',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});