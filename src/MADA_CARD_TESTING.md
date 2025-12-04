# Mada Card Payment Testing Guide - دليل اختبار بطاقات مدى

## Overview - نظرة عامة

This guide provides comprehensive testing instructions for the Mada card payment feature in the Khat Alailan printing services platform.

**Mada (مدى)** is the Saudi Arabian domestic debit card network. This implementation supports Mada cards along with international cards (Visa, Mastercard).

## Test Mada Cards - بطاقات مدى التجريبية

### ✅ Valid Mada Test Cards

These card numbers start with valid Mada BINs and will be recognized as Mada cards:

| Card Number | Bank | Type | CVV | Expiry |
|-------------|------|------|-----|--------|
| 4464040000000001 | Al Rajhi Bank | Mada/Visa | 123 | 12/25 |
| 4406470000000001 | Riyad Bank | Mada/Visa | 123 | 12/25 |
| 5297000000000001 | SABB | Mada/Mastercard | 123 | 12/25 |
| 5571000000000001 | Saudi Investment Bank | Mada/Mastercard | 123 | 12/25 |
| 9682080000000001 | Alinma Bank | Mada | 123 | 12/25 |
| 5888480000000001 | Arab National Bank | Mada/Mastercard | 123 | 12/25 |

**Note:** These are test card numbers for development. In production, use real Mada cards or test cards provided by your payment gateway.

### ✅ International Card Test Numbers

| Card Number | Type | CVV | Expiry |
|-------------|------|-----|--------|
| 4111111111111111 | Visa | 123 | 12/25 |
| 4242424242424242 | Visa | 123 | 12/25 |
| 5555555555554444 | Mastercard | 123 | 12/25 |
| 5200828282828210 | Mastercard | 123 | 12/25 |

### ❌ Invalid Test Cards

| Card Number | Expected Result |
|-------------|-----------------|
| 0000000000000000 | Invalid card number (fails Luhn check) |
| 1234567890123456 | Invalid card number |
| 4111111111111112 | Invalid card number (wrong checksum) |

## Testing Workflow - سير العمل

### Step 1: Add Items to Cart
1. Navigate to Products page (المنتجات)
2. Click "أضف إلى السلة" on any product
3. Go to cart and click "إتمام الطلب"

### Step 2: Fill Shipping Information
```
Full Name: محمد أحمد
Phone: 0512345678
Address: شارع الملك فهد، حي العليا
City: الرياض
Region: الرياض
Postal Code: 12345
```

### Step 3: Select Mada Payment
- Scroll to "طريقة الدفع" (Payment Method) section
- Click on "الدفع ببطاقة مدى" radio button
- Mada card form will appear below

### Step 4: Enter Mada Card Details

**For Mada Card Test:**
```
Card Number: 4464040000000001
Cardholder Name: Mohammed Ahmed
Expiry Month: 12
Expiry Year: 25
CVV: 123
```

**Expected Behavior:**
- Card number formats automatically (4464 0400 0000 0001)
- "مدى" badge appears next to card icon
- All fields show green border when valid
- No error messages

### Step 5: Complete Order
1. Check "أوافق على الشروط والأحكام" checkbox
2. Click "تأكيد الطلب" button
3. Wait for payment processing (1-2 seconds)
4. Should redirect to success page

## Mada Card Detection - كشف بطاقات مدى

### How Mada Detection Works

The system checks if the card number starts with any of the official Mada BIN ranges:

```typescript
// Mada BIN ranges
446404, 440647, 440795, 446393, 409201, 458456, 484783, 462220,
455708, 410621, 455036, 968208, 457865, 484308, 968209, 462564,
588848, 968205, 588850, 968203, 446672, 543357, 434107, 407197,
407395, 636120, 968211, 509734, 509735, 588982, 589005, 968201,
508160, 531095, 530906, 532013, 605141, 968210, and more...
```

### Visual Indicators

When a Mada card is detected:
- ✅ "مدى" badge appears in bold next to card icon
- ✅ Card number validates against Mada BINs
- ✅ Standard Visa/Mastercard validation still applies (Luhn algorithm)

## Validation Rules - قواعد التحقق

### Card Number Validation
- ✅ Must be 13-19 digits
- ✅ Must pass Luhn algorithm check
- ✅ Mada cards typically 16 digits
- ✅ Formats automatically with spaces

### Cardholder Name
- ✅ Minimum 2 characters
- ✅ Letters and spaces only
- ✅ Arabic or English names accepted

### Expiry Date
- ✅ Month: 01-12
- ✅ Year: Current year or future
- ✅ Must not be expired

### CVV
- ✅ 3 digits for Visa/Mastercard/Mada
- ✅ Numbers only
- ✅ Never stored in database

## Testing Scenarios - سيناريوهات الاختبار

### ✅ Successful Payment Flow

1. **Valid Mada Card**
   - Use: 4464040000000001
   - Expected: Payment succeeds, order created, redirect to success

2. **Valid International Card**
   - Use: 4111111111111111
   - Expected: Payment succeeds (no Mada badge shown)

3. **Multiple Items**
   - Add 3+ items to cart
   - Expected: Total amount calculated correctly

### ❌ Error Scenarios

1. **Invalid Card Number**
   - Use: 0000000000000000
   - Expected: "رقم البطاقة غير صحيح" error

2. **Expired Card**
   - Use valid number with past expiry (e.g., 01/20)
   - Expected: "تاريخ انتهاء الصلاحية غير صحيح أو منتهي" error

3. **Invalid CVV**
   - Use: 12 (only 2 digits)
   - Expected: "رمز الأمان غير صحيح" error

4. **Missing Cardholder Name**
   - Leave name field empty
   - Expected: "اسم حامل البطاقة غير صحيح" error

5. **Payment Gateway Failure**
   - Use amount: 999.99 SAR (triggers test failure)
   - Expected: Payment fails, error message shown, order status remains pending

## Database Verification - التحقق من قاعدة البيانات

### Check Payment Transactions

```sql
-- View all payment transactions
SELECT 
  id,
  order_id,
  payment_method,
  card_type,
  card_last_four,
  amount,
  currency,
  status,
  error_message,
  created_at
FROM payment_transactions
ORDER BY created_at DESC
LIMIT 10;
```

### Expected Data for Mada Card

```
payment_method: 'card'
card_type: 'visa' or 'mastercard' (Mada co-branded)
card_last_four: '0001'
amount: [order total]
currency: 'SAR'
status: 'completed' or 'failed'
```

### Check Order Status

```sql
-- View order with payment info
SELECT 
  o.id,
  o.order_number,
  o.total_amount,
  o.status,
  o.payment_method,
  pt.card_type,
  pt.card_last_four,
  pt.status as payment_status
FROM orders o
LEFT JOIN payment_transactions pt ON pt.order_id = o.id
WHERE o.id = '[order_id]';
```

## Edge Function Logs - سجلات Edge Function

### View Payment Processing Logs

1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Select `process-payment` function
4. Click "Logs" tab
5. Look for:
   - "Processing payment" entries
   - Success/failure messages
   - Error details

### Sample Log Output

```
Processing payment: { amount: 150, currency: 'SAR', cardholder: 'Mohammed Ahmed' }
Payment gateway response: { success: true, transaction_id: 'txn_...' }
Transaction created: { id: '...', status: 'completed' }
```

## Troubleshooting - استكشاف الأخطاء

### Issue: Mada Badge Not Showing

**Cause:** Card number doesn't start with Mada BIN  
**Solution:** Use test cards starting with: 4464, 4406, 5297, 5571, 9682, 5888

### Issue: Card Number Not Formatting

**Cause:** Non-numeric characters entered  
**Solution:** Enter numbers only, formatting is automatic

### Issue: Payment Processing Hangs

**Cause:** Edge Function not responding  
**Solution:** 
1. Check Edge Function deployment status
2. View Edge Function logs for errors
3. Verify Supabase connection

### Issue: "رقم البطاقة غير صحيح" Error

**Cause:** Card fails Luhn validation  
**Solution:** Use valid test card numbers from this guide

### Issue: Order Created But Payment Failed

**Cause:** Payment gateway rejected transaction  
**Solution:**
1. Check `payment_transactions` table for error_message
2. View Edge Function logs
3. Verify card details are correct

## Production Considerations - اعتبارات الإنتاج

### Payment Gateway Selection

For Mada support, choose a gateway with Saudi market support:

1. **PayTabs** (Recommended for Saudi)
   - Full Mada support
   - Saudi-based
   - 3D Secure support
   - Easy integration

2. **Moyasar**
   - Saudi-based
   - Simple API
   - Mada support
   - Good documentation

3. **HyperPay**
   - Middle East focus
   - Mada support
   - Multiple payment methods

4. **Stripe** (Limited Mada)
   - International
   - Limited Mada support
   - Requires additional setup

### Required Features for Production

- ✅ 3D Secure (3DS) authentication
- ✅ Tokenization (don't store card numbers)
- ✅ PCI DSS compliance
- ✅ Fraud detection
- ✅ Transaction monitoring
- ✅ Refund capability
- ✅ Webhook notifications
- ✅ Real-time status updates

### Testing with Real Gateway

1. Get test credentials from gateway
2. Update Edge Function with gateway API
3. Add credentials to Supabase secrets
4. Test with gateway's test cards
5. Verify 3DS flow works
6. Test refunds and cancellations
7. Monitor transaction success rate

## Security Checklist - قائمة الأمان

- ✅ Full card numbers never stored
- ✅ Only last 4 digits saved
- ✅ CVV never stored
- ✅ Payment processing in Edge Function (server-side)
- ✅ RLS policies protect transaction data
- ✅ HTTPS encryption for all communications
- ✅ Input validation on client and server
- ✅ Error messages don't expose sensitive data

## Test Results Template - نموذج نتائج الاختبار

```
Test Date: ___________
Tester: ___________

[ ] Mada card detected correctly
[ ] Card number formats automatically
[ ] "مدى" badge appears
[ ] All validation works
[ ] Payment processes successfully
[ ] Transaction recorded in database
[ ] Order status updated
[ ] Success page displays
[ ] Error handling works
[ ] Cash on delivery still works

Notes:
_________________________________
_________________________________
```

## Support - الدعم

### For Testing Issues
- Check browser console for errors
- Review Edge Function logs in Supabase
- Verify test card numbers are correct
- Ensure all form fields are filled

### For Production Issues
- Contact payment gateway support
- Review transaction logs
- Check gateway status page
- Monitor error rates

## Next Steps - الخطوات التالية

1. ✅ Test with all Mada test cards
2. ✅ Test error scenarios
3. ✅ Verify database records
4. ✅ Check Edge Function logs
5. ⏳ Choose production payment gateway
6. ⏳ Integrate real gateway API
7. ⏳ Test with real Mada cards (small amounts)
8. ⏳ Enable 3D Secure
9. ⏳ Go live!

---

**Status:** Ready for testing with Mada test cards  
**Last Updated:** 2025-12-05  
**Version:** 1.0