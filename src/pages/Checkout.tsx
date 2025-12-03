import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Phone, User, Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ShippingAddress, PaymentMethod } from '@/types';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart, refreshCart } = useCart();
  const { toast } = useToast();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    region: '',
    postal_code: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total with tax
  const calculateTotalWithTax = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.15; // 15% VAT for Saudi Arabia
    return subtotal + tax;
  };

  const validateForm = (): string | null => {
    if (!shippingAddress.full_name.trim()) {
      return 'يرجى إدخال الاسم الكامل';
    }
    if (!shippingAddress.phone.trim()) {
      return 'يرجى إدخال رقم الهاتف';
    }
    
    // Clean phone number
    const cleanPhone = shippingAddress.phone.replace(/\s/g, '');
    if (!/^(05|5)\d{8}$/.test(cleanPhone)) {
      return 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)';
    }
    
    if (!shippingAddress.address_line1.trim()) {
      return 'يرجى إدخال العنوان';
    }
    if (!shippingAddress.city.trim()) {
      return 'يرجى إدخال المدينة';
    }
    if (!shippingAddress.region.trim()) {
      return 'يرجى إدخال المنطقة';
    }
    return null;
  };
// In Checkout.tsx, update the handlePlaceOrder function:
const handlePlaceOrder = async () => {
  setError(null);
  
  if (items.length === 0) {
    toast({
      title: 'السلة فارغة',
      description: 'يرجى إضافة منتجات إلى السلة أولاً',
      variant: 'destructive',
    });
    return;
  }

  const validationError = validateForm();
  if (validationError) {
    toast({
      title: 'يرجى إكمال جميع الحقول',
      description: validationError,
      variant: 'destructive',
    });
    return;
  }

  setProcessing(true);
  try {
    console.log('Placing order with:', {
      userId: user?.id,
      itemCount: items.length,
      total: getTotalPrice()
    });

    // Format phone number
    const formattedPhone = shippingAddress.phone.replace(/\s/g, '');
    const formattedAddress = {
      ...shippingAddress,
      phone: formattedPhone,
    };

    // Create checkout data WITHOUT notes since your table doesn't have it
    const checkoutData = {
      shipping_address: formattedAddress,
      payment_method: paymentMethod,
      // Don't include notes for now
      // notes: notes.trim() || null,
    };

    console.log('Checkout data:', checkoutData);
    console.log('Cart items:', items);

    // Try to create order
    const order = await api.createOrder(checkoutData, items, user?.id);
    console.log('Order created successfully:', order);

    // Clear cart
    await clearCart();

    // Navigate to success page
    navigate(`/order-success/${order.id}`, {
      state: { orderNumber: order.order_number || order.id }
    });

  } catch (error: any) {
    console.error('Error placing order:', error);
    
    // More detailed error logging
    if (error?.message) {
      console.error('Error message:', error.message);
    }
    if (error?.details) {
      console.error('Error details:', error.details);
    }
    if (error?.hint) {
      console.error('Error hint:', error.hint);
    }
    if (error?.code) {
      console.error('Error code:', error.code);
    }

    let errorMessage = 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.';
    
    if (error?.message?.includes('notes') || error?.code === 'PGRST204') {
      errorMessage = 'خطأ في قاعدة البيانات. يرجى التواصل مع الدعم الفني.';
      console.error('Database schema mismatch - notes column missing');
    } else if (error?.message?.includes('400')) {
      errorMessage = 'بيانات الطلب غير صحيحة. يرجى التحقق من معلوماتك وإعادة المحاولة.';
    } else if (error?.message?.includes('network')) {
      errorMessage = 'مشكلة في الاتصال بالإنترنت. يرجى التحقق من اتصالك وإعادة المحاولة.';
    } else if (error?.message?.includes('auth') || error?.message?.includes('session')) {
      errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
    }

    setError(errorMessage);
    
    toast({
      title: 'خطأ في معالجة الطلب',
      description: errorMessage,
      variant: 'destructive',
    });

    // Refresh cart in case of partial failure
    await refreshCart();
  } finally {
    setProcessing(false);
  }
};
  // Handle retry
  const handleRetry = () => {
    setError(null);
    refreshCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 xl:px-6">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">السلة فارغة</h2>
              <p className="text-muted-foreground mb-6">
                لا توجد منتجات في سلة التسوق
              </p>
              <Button onClick={() => navigate('/products')}>
                تصفح المنتجات
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 xl:px-6">
        <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  المحاولة مرة أخرى
                </Button>
                <Button variant="outline" size="sm" onClick={() => setError(null)}>
                  إغلاق
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  عنوان التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">
                      الاسم الكامل <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        value={shippingAddress.full_name}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="أدخل الاسم الكامل"
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      رقم الهاتف <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="05XXXXXXXX"
                        className="pr-10"
                        required
                        pattern="(05|5)[0-9]{8}"
                        maxLength={10}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      مثال: 0512345678 أو 512345678
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line1">
                    العنوان <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Home className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address_line1"
                      value={shippingAddress.address_line1}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line1: e.target.value }))}
                      placeholder="الشارع، رقم المبنى"
                      className="pr-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line2">
                    تفاصيل إضافية (اختياري)
                  </Label>
                  <Input
                    id="address_line2"
                    value={shippingAddress.address_line2}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line2: e.target.value }))}
                    placeholder="رقم الشقة، الدور، إلخ"
                  />
                </div>

                <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      المدينة <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="المدينة"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">
                      المنطقة <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={shippingAddress.region}
                      onValueChange={(value) => setShippingAddress(prev => ({ ...prev, region: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الرياض">الرياض</SelectItem>
                        <SelectItem value="مكة المكرمة">مكة المكرمة</SelectItem>
                        <SelectItem value="المدينة المنورة">المدينة المنورة</SelectItem>
                        <SelectItem value="الشرقية">الشرقية</SelectItem>
                        <SelectItem value="القصيم">القصيم</SelectItem>
                        <SelectItem value="حائل">حائل</SelectItem>
                        <SelectItem value="تبوك">تبوك</SelectItem>
                        <SelectItem value="الحدود الشمالية">الحدود الشمالية</SelectItem>
                        <SelectItem value="جازان">جازان</SelectItem>
                        <SelectItem value="نجران">نجران</SelectItem>
                        <SelectItem value="الباحة">الباحة</SelectItem>
                        <SelectItem value="الجوف">الجوف</SelectItem>
                        <SelectItem value="عسير">عسير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">
                      الرمز البريدي (اختياري)
                    </Label>
                    <Input
                      id="postal_code"
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                      placeholder="12345"
                      pattern="[0-9]{5}"
                      maxLength={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  طريقة الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <RadioGroupItem value="cash" id="payment-cash" />
                      <Label htmlFor="payment-cash" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">الدفع عند الاستلام</p>
                          <p className="text-sm text-muted-foreground">ادفع نقداً عند استلام الطلب</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <RadioGroupItem value="card" id="payment-card" />
                      <Label htmlFor="payment-card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">الدفع ببطاقة الائتمان</p>
                          <p className="text-sm text-muted-foreground">ادفع بأمان باستخدام بطاقتك</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>ملاحظات الطلب (اختياري)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف أي ملاحظات أو تعليمات خاصة بالطلب..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {items.map((item) => {
                    // Calculate item price with options
                    let itemPrice = item.product?.base_price || 0;
                    
                    // Check for custom options price modifiers
                    if (item.custom_options) {
                      try {
                        const customOpts = typeof item.custom_options === 'string' 
                          ? JSON.parse(item.custom_options) 
                          : item.custom_options;
                        
                        if (customOpts?.final_unit_price) {
                          itemPrice = customOpts.final_unit_price;
                        } else if (customOpts?.priceModifiers) {
                          // Sum up price modifiers
                          const modifiersTotal = Object.values(customOpts.priceModifiers as Record<string, number>)
                            .reduce((sum: number, mod) => sum + (mod || 0), 0);
                          itemPrice += modifiersTotal;
                        }
                      } catch (e) {
                        console.error('Error parsing custom options:', e);
                      }
                    }

                    return (
                      <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.image_url || '/placeholder-image.svg'}
                            alt={item.product?.name_ar || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.product?.name_ar || 'Product'}
                          </p>
                          <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                          
                          {/* Show selected options if any */}
                          {item.custom_options && (
                            <div className="mt-1 space-y-1">
                              {(() => {
                                try {
                                  const customOpts = typeof item.custom_options === 'string' 
                                    ? JSON.parse(item.custom_options) 
                                    : item.custom_options;
                                  
                                  return Object.entries(customOpts)
                                    .filter(([key, value]) => 
                                      key !== 'base_price' && 
                                      key !== 'final_unit_price' && 
                                      key !== 'priceModifiers' &&
                                      value && 
                                      typeof value === 'object' && 
                                      'name' in (value as any)
                                    )
                                    .map(([key, value]: [string, any]) => (
                                      <div key={key} className="flex items-center gap-1 text-xs">
                                        <span className="text-muted-foreground">{value.name}:</span>
                                        {value.price_addition !== 0 && (
                                          <span className={`font-medium ${value.price_addition > 0 ? 'text-primary' : 'text-green-600'}`}>
                                            {value.price_addition > 0 ? '+' : ''}{value.price_addition.toFixed(2)} ر.س
                                          </span>
                                        )}
                                      </div>
                                    ));
                                } catch (e) {
                                  return null;
                                }
                              })()}
                            </div>
                          )}
                          
                          <p className="text-sm font-medium text-primary mt-1">
                            {(itemPrice * item.quantity).toFixed(2)} ر.س
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي:</span>
                    <span className="font-medium">{getTotalPrice().toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن:</span>
                    <span className="font-medium">مجاني</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الضريبة (15%):</span>
                    <span className="font-medium">{(getTotalPrice() * 0.15).toFixed(2)} ر.س</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">الإجمالي:</span>
                  <span className="text-2xl font-bold text-primary">
                    {calculateTotalWithTax().toFixed(2)} ر.س
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {processing ? 'جاري معالجة الطلب...' : 'تأكيد الطلب'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  بالنقر على "تأكيد الطلب"، أنت توافق على شروط وأحكام الخدمة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}