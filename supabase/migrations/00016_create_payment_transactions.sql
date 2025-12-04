/*
# Create Payment Transactions Table - جدول معاملات الدفع

## Overview
This migration creates the payment_transactions table to store Mada card and other card payment records
and transaction details for orders. Supports Saudi Mada network and international cards.

## Tables Created

### payment_transactions
Stores payment transaction records for orders (Mada, Visa, Mastercard, etc.).

**Columns:**
- `id` (uuid, primary key) - Unique transaction identifier
- `order_id` (uuid, references orders.id) - Associated order
- `payment_method` (text) - Payment method used (card, cash, etc.)
- `card_type` (text, nullable) - Card brand (visa, mastercard, amex, mada, etc.)
- `card_last_four` (text, nullable) - Last 4 digits of card number (PCI compliant)
- `cardholder_name` (text, nullable) - Name on the card
- `amount` (numeric) - Transaction amount
- `currency` (text, default: 'SAR') - Currency code (Saudi Riyal)
- `status` (text) - Transaction status (pending, completed, failed, refunded)
- `transaction_id` (text, nullable) - External payment gateway transaction ID
- `gateway_response` (jsonb, nullable) - Full response from payment gateway
- `error_message` (text, nullable) - Error message if transaction failed
- `processed_at` (timestamptz, nullable) - When payment was processed
- `created_at` (timestamptz, default: now()) - Record creation timestamp
- `updated_at` (timestamptz, default: now()) - Last update timestamp

## Security
- Enable RLS on payment_transactions table
- Users can view their own payment transactions
- Admins can view all payment transactions
- Only Edge Functions can create/update payment transactions (via service role)

## Indexes
- Index on order_id for fast lookups
- Index on status for filtering
- Index on created_at for sorting

## Notes
- Never store full card numbers or CVV codes
- Only store last 4 digits for reference
- Use Edge Functions for secure payment processing
- Gateway responses stored as JSONB for flexibility
*/

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  payment_method text NOT NULL,
  card_type text,
  card_last_four text,
  cardholder_name text,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'SAR' NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  transaction_id text,
  gateway_response jsonb,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payment transactions
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payment_transactions.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Policy: Admins can view all payment transactions
CREATE POLICY "Admins can view all payment transactions" ON payment_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'::user_role
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_transaction_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_transaction_updated_at();

-- Add comment
COMMENT ON TABLE payment_transactions IS 'Stores payment transaction records for orders';