# Quick Reference Guide - New Features

## For Users

### How to Register
1. Go to `/login`
2. Click "Sign Up" tab
3. Fill in:
   - Username (required)
   - Password (required)
   - Confirm Password (required)
   - Full Name (optional)
   - Email (optional)
   - Phone (optional)
4. Click "Create Account"

**OR use Social Auth:**
- Click "Sign up with Google" or "Sign up with Facebook"

### How to Login
1. Go to `/login`
2. Enter username and password
3. Click "Sign In"

**OR use Social Auth:**
- Click "Sign in with Google" or "Sign in with Facebook"

### How to Manage Profile
1. Click user icon in header
2. Select "Profile"
3. Update information in "Profile Information" tab
4. Change password in "Security" tab

### How to Shop
1. Browse products at `/products`
2. Click product to view details
3. Select options (see price changes)
4. Click "Add to Cart"
5. Go to cart, click "Proceed to Checkout"
6. Fill shipping info
7. Select payment method
8. Click "Place Order"

## For Administrators

### How to Manage Product Options
1. Login as admin
2. Go to `/admin/product-options`

**Create Templates:**
1. Go to "Templates" tab
2. Click "Create Template"
3. Fill in option details
4. Click "Create"

**Add Values:**
1. Go to "Values" tab
2. Click "Create Value"
3. Select template
4. Enter value and price modifier
5. Click "Create"

**Assign to Products:**
1. Go to "Assignments" tab
2. Click "Assign Option"
3. Select product and template
4. Click "Assign"

## Routes

### Public Routes
- `/` - Home page
- `/products` - Products listing
- `/products/:slug` - Product details
- `/login` - Login/Register
- `/contact` - Contact page

### User Routes (Login Required)
- `/profile` - User profile
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/order/success/:orderId` - Order confirmation
- `/order/failed` - Order failed

### Admin Routes (Admin Only)
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/product-options` - Manage product options

## Key Features

### Registration Fields
- ✅ Username (required)
- ✅ Password (required)
- ✅ Confirm Password (required)
- ✅ Full Name (optional)
- ✅ Email (optional)
- ✅ Phone (optional)

### Social Auth
- ✅ Google Sign In
- ✅ Facebook Sign In

### Profile Management
- ✅ View profile info
- ✅ Edit full name
- ✅ Edit email
- ✅ Edit phone
- ✅ Change password

### Product Options
- ✅ Create option templates
- ✅ Add option values with price modifiers
- ✅ Assign options to products
- ✅ Dynamic price calculation
- ✅ Price modifiers display

### Checkout Flow
- ✅ Cart with options
- ✅ Shipping form
- ✅ Payment selection
- ✅ Order summary
- ✅ Order confirmation
- ✅ Error handling

## Validation Rules

### Registration
- Username: Required, unique
- Password: Required, min 6 characters
- Confirm Password: Must match password
- Email: Valid email format (if provided)
- Phone: Saudi format 05XXXXXXXX (if provided)

### Profile Update
- Full Name: Any text
- Email: Valid email format
- Phone: Saudi format 05XXXXXXXX

### Password Change
- New Password: Min 6 characters
- Confirm Password: Must match new password

### Checkout
- Full Name: Required, min 2 characters
- Phone: Required, Saudi format
- Address: Required, min 5 characters
- City: Required, min 2 characters
- Region: Required, min 2 characters
- Payment Method: Required (card/cash)

## Price Calculation

### Formula
```
Item Price = Base Price + Sum(Option Price Modifiers)
Subtotal = Sum(Item Price × Quantity)
Tax = Subtotal × 0.15 (15% VAT)
Total = Subtotal + Tax
```

### Example
- Base Price: 100 SAR
- Design Service (+10 SAR)
- Large Size (+50 SAR)
- **Item Total: 160 SAR**
- Tax (15%): 24 SAR
- **Final Total: 184 SAR**

## Common Tasks

### Add Product with Options
1. Admin creates option template (e.g., "Size")
2. Admin adds values (Small +0, Medium +20, Large +50)
3. Admin assigns "Size" to product
4. Customer sees options on product page
5. Customer selects option, price updates
6. Customer adds to cart with selected options

### Complete Order
1. Customer adds items to cart
2. Customer goes to checkout
3. Customer fills shipping form
4. Customer selects payment method
5. Customer reviews order
6. Customer places order
7. System creates order in database
8. Customer sees confirmation page

### Update Profile
1. User clicks profile icon
2. User selects "Profile"
3. User updates information
4. User clicks "Update Profile"
5. System saves changes
6. User sees success message

## Troubleshooting

### Can't Register
- Check username is unique
- Ensure passwords match
- Verify email format (if provided)
- Check phone format (if provided)

### Can't Login
- Verify username and password
- Check if account exists
- Try password reset (if implemented)

### Social Auth Not Working
- Check Supabase OAuth configuration
- Verify redirect URLs
- Check provider credentials

### Profile Won't Update
- Ensure logged in
- Check field validation
- Verify network connection

### Order Failed
- Check all required fields
- Verify phone number format
- Ensure cart has items
- Check network connection

## Support

For help:
- Check NEW_FEATURES_SUMMARY.md for detailed documentation
- Review IMPLEMENTATION_SUMMARY.md for checkout flow
- Contact development team
