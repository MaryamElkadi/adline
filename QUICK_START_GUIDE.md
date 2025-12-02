# Quick Start Guide: Dynamic Pricing & Checkout Flow

## For Administrators

### Setting Up Product Options

1. **Login as Admin**
   - Navigate to `/login`
   - Enter admin credentials

2. **Access Product Options**
   - Click "Product Options" in the admin sidebar
   - Or navigate to `/admin/product-options`

3. **Create Option Templates**
   - Go to the "Templates" tab
   - Click "Create Template"
   - Fill in:
     - Option Type (unique identifier, e.g., "design_service")
     - Arabic Name (e.g., "خدمة التصميم")
     - English Name (optional)
     - Is Required (checkbox)
     - Display Order (number for sorting)
   - Click "Create"

4. **Add Option Values**
   - Go to the "Values" tab
   - Click "Create Value"
   - Fill in:
     - Select Template (from dropdown)
     - Arabic Value (e.g., "لدي تصميم بحاجة تعديل")
     - English Value (optional)
     - Price Modifier (e.g., 10 for +10 SAR, -5 for -5 SAR)
     - Is Available (checkbox)
     - Display Order (number for sorting)
   - Click "Create"

5. **Assign Options to Products**
   - Go to the "Assignments" tab
   - Click "Assign Option"
   - Select:
     - Product (from dropdown)
     - Option Template (from dropdown)
   - Click "Assign"

### Example Setup

**Template: Design Service**
- Option Type: `design_service`
- Arabic Name: `خدمة التصميم`
- Is Required: Yes
- Display Order: 1

**Values for Design Service:**
1. "لدي تصميم جاهز" - Price Modifier: 0
2. "لدي تصميم بحاجة تعديل" - Price Modifier: 10
3. "طلب خدمة تصميم" - Price Modifier: 250

**Template: Size**
- Option Type: `size`
- Arabic Name: `الحجم`
- Is Required: Yes
- Display Order: 2

**Values for Size:**
1. "صغير" - Price Modifier: 0
2. "متوسط" - Price Modifier: 20
3. "كبير" - Price Modifier: 50

## For Customers

### Shopping Flow

1. **Browse Products**
   - Navigate to `/products`
   - Click on any product to view details

2. **Select Options**
   - On the product detail page, you'll see all available options
   - Each option shows its price modifier (e.g., "+ 50 ر.س")
   - Select your preferred options
   - Watch the total price update automatically

3. **Add to Cart**
   - Click "Add to Cart"
   - Your selections are saved with the product

4. **View Cart**
   - Navigate to `/cart`
   - See all your items with:
     - Selected options
     - Price modifiers for each option
     - Total price per item
     - Cart total

5. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in shipping information:
     - Full Name
     - Phone (Saudi format: 05XXXXXXXX)
     - Address
     - City
     - Region
   - Select payment method:
     - Cash on Delivery
     - Credit Card
   - Review order summary with price breakdown
   - Click "Place Order"

6. **Order Confirmation**
   - View order details on success page
   - Note your order ID for reference

## Price Calculation Example

**Product: Business Card Design**
- Base Price: 100 SAR

**Selected Options:**
- Design Service: "لدي تصميم بحاجة تعديل" (+10 SAR)
- Size: "كبير" (+50 SAR)

**Calculation:**
- Base Price: 100 SAR
- Design Service: +10 SAR
- Size: +50 SAR
- **Subtotal: 160 SAR**
- Tax (15%): 24 SAR
- **Total: 184 SAR**

## Validation Rules

### Phone Number Format
- Must start with 05 or 5
- Must be exactly 10 digits (including the 0)
- Examples:
  - ✅ 0512345678
  - ✅ 512345678
  - ❌ 12345678 (too short)
  - ❌ 0612345678 (wrong prefix)

### Required Fields
- All fields marked with * are required
- Minimum length requirements apply
- Error messages appear in Arabic

## Troubleshooting

### "يرجى اختيار [option name]"
- You haven't selected a required option
- Select a value for the highlighted option

### "رقم الهاتف غير صحيح"
- Phone number doesn't match Saudi format
- Ensure it starts with 05 and has 10 digits

### "فشل إنشاء الطلب"
- Order creation failed
- Check your internet connection
- Ensure all required fields are filled
- Try again or contact support

## Admin Tips

1. **Organize Options**
   - Use display_order to control the sequence of options
   - Lower numbers appear first

2. **Price Modifiers**
   - Use positive numbers to add to the price
   - Use negative numbers to reduce the price
   - Use 0 for no price change

3. **Required Options**
   - Mark essential options as required
   - Users must select these before adding to cart

4. **Option Availability**
   - Uncheck "Is Available" to temporarily hide an option value
   - Useful for out-of-stock variations

5. **Reusable Templates**
   - Create templates once, assign to multiple products
   - Update template values to affect all assigned products

## API Endpoints (for developers)

### Product Options
- `GET /product_option_templates` - List all templates
- `GET /product_option_values` - List all values
- `GET /product_option_assignments` - List all assignments
- `POST /product_option_templates` - Create template
- `PUT /product_option_templates/:id` - Update template
- `DELETE /product_option_templates/:id` - Delete template

### Orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details
- `GET /orders?user_id=:userId` - Get user orders
- `PUT /orders/:id/status` - Update order status

## Support

For technical issues or questions:
- Check the IMPLEMENTATION_SUMMARY.md for detailed technical information
- Review the TODO_CHECKOUT_FLOW.md for implementation status
- Contact the development team
