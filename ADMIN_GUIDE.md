# Admin Guide - Product Options Management

## 🎯 Quick Start Guide

### Accessing Product Options Management

1. **Login as Admin**
   - Go to `/login`
   - Sign in with admin credentials
   - You'll be redirected to `/admin/dashboard`

2. **Navigate to Product Options**
   - Click "Product Options" in the admin sidebar
   - Or go directly to `/admin/product-options`

---

## 📋 Three Main Sections

### 1️⃣ Templates Tab

**What are Templates?**
Templates are the types of options customers can choose from (e.g., Size, Material, Design Type).

**How to Create a Template:**

1. Click the **"Templates"** tab
2. Click **"Create Template"** button
3. Fill in the form:
   - **Option Type**: Internal identifier (e.g., `size`, `material`, `design`)
   - **Name (English)**: Display name in English (e.g., "Size", "Material")
   - **Name (Arabic)**: Display name in Arabic (e.g., "الحجم", "المادة")
   - **Required Option**: Toggle ON if customers must select this option
   - **Display Order**: Number to control the order (lower numbers appear first)
4. Click **"Create"**

**Example Templates:**
```
Type: size
English: Size
Arabic: الحجم
Required: Yes
Order: 1

Type: material
English: Material
Arabic: المادة
Required: Yes
Order: 2

Type: design
English: Design Service
Arabic: خدمة التصميم
Required: No
Order: 3
```

**Managing Templates:**
- ✏️ **Edit**: Click the edit icon to modify template details
- 🗑️ **Delete**: Click the trash icon to remove (will ask for confirmation)

---

### 2️⃣ Values Tab

**What are Values?**
Values are the specific choices within each template (e.g., Small, Medium, Large for Size).

**How to Create a Value:**

1. Click the **"Values"** tab
2. Click **"Create Value"** button
3. Fill in the form:
   - **Template**: Select which template this value belongs to
   - **Value (English)**: The choice name in English (e.g., "Small", "Large")
   - **Value (Arabic)**: The choice name in Arabic (e.g., "صغير", "كبير")
   - **Price Modifier (SAR)**: Additional cost or discount
     - Positive number (e.g., `50`) = adds 50 SAR to price
     - Negative number (e.g., `-20`) = reduces price by 20 SAR
     - Zero (`0`) = no price change
   - **Available**: Toggle ON if this option is currently available
   - **Display Order**: Number to control the order
4. Click **"Create"**

**Example Values for Size Template:**
```
Template: Size
English: Small (10x10 cm)
Arabic: صغير (10×10 سم)
Price: 0 SAR (base price)
Available: Yes
Order: 1

Template: Size
English: Medium (20x20 cm)
Arabic: متوسط (20×20 سم)
Price: +50 SAR
Available: Yes
Order: 2

Template: Size
English: Large (30x30 cm)
Arabic: كبير (30×30 سم)
Price: +100 SAR
Available: Yes
Order: 3
```

**Example Values for Material Template:**
```
Template: Material
English: Standard Paper
Arabic: ورق عادي
Price: 0 SAR
Available: Yes
Order: 1

Template: Material
English: Premium Glossy
Arabic: ورق لامع فاخر
Price: +30 SAR
Available: Yes
Order: 2

Template: Material
English: Matte Finish
Arabic: ورق مطفي
Price: +25 SAR
Available: Yes
Order: 3
```

**Example Values for Design Service Template:**
```
Template: Design Service
English: Use My Design
Arabic: استخدام تصميمي
Price: 0 SAR
Available: Yes
Order: 1

Template: Design Service
English: Basic Design Service
Arabic: خدمة تصميم أساسية
Price: +100 SAR
Available: Yes
Order: 2

Template: Design Service
English: Premium Design Service
Arabic: خدمة تصميم متقدمة
Price: +250 SAR
Available: Yes
Order: 3
```

**Managing Values:**
- ✏️ **Edit**: Click the edit icon to modify value details
- 🗑️ **Delete**: Click the trash icon to remove
- 💰 **Price Modifiers**: Green = adds cost, Red = discount, Black = no change
- ✅ **Availability**: Badge shows if option is available or unavailable

---

### 3️⃣ Assignments Tab

**What are Assignments?**
Assignments link templates to specific products. This determines which options appear for each product.

**How to Assign Options to Products:**

1. Click the **"Assignments"** tab
2. Click **"Assign Option"** button
3. Fill in the form:
   - **Product**: Select the product
   - **Option Template**: Select which template to assign
4. Click **"Assign"**

**Example Assignments:**
```
Product: Business Cards
→ Assign: Size template
→ Assign: Material template
→ Assign: Design Service template

Product: Stickers
→ Assign: Size template
→ Assign: Material template
→ Assign: Shape template

Product: Brochures
→ Assign: Size template
→ Assign: Paper Type template
→ Assign: Folding Style template
```

**Managing Assignments:**
- 🗑️ **Remove**: Click the trash icon to unassign an option from a product

---

## 🔄 Complete Workflow Example

### Setting Up Options for "Business Cards"

**Step 1: Create Templates**

1. Go to Templates tab
2. Create "Size" template (required)
3. Create "Material" template (required)
4. Create "Design Service" template (optional)

**Step 2: Add Values**

1. Go to Values tab
2. For Size template:
   - Add "Standard (9x5 cm)" - 0 SAR
   - Add "Large (10x6 cm)" - +20 SAR
3. For Material template:
   - Add "Standard Paper" - 0 SAR
   - Add "Premium Glossy" - +30 SAR
   - Add "Matte Finish" - +25 SAR
4. For Design Service template:
   - Add "Use My Design" - 0 SAR
   - Add "Basic Design" - +100 SAR
   - Add "Premium Design" - +250 SAR

**Step 3: Assign to Product**

1. Go to Assignments tab
2. Assign "Size" to "Business Cards"
3. Assign "Material" to "Business Cards"
4. Assign "Design Service" to "Business Cards"

**Result:**
When customers view Business Cards:
- They MUST select a Size (required)
- They MUST select a Material (required)
- They CAN select a Design Service (optional)
- Price updates automatically based on selections

---

## 💡 Best Practices

### Template Naming
- ✅ Use clear, descriptive names
- ✅ Keep English and Arabic names consistent
- ✅ Use lowercase for option_type (e.g., `size`, not `Size`)

### Value Naming
- ✅ Include measurements in the name (e.g., "Small (10x10 cm)")
- ✅ Be specific about what the customer gets
- ✅ Keep names concise but informative

### Price Modifiers
- ✅ Use 0 for the base/default option
- ✅ Use positive numbers for premium options
- ✅ Use negative numbers for discounts or promotions
- ✅ Consider your profit margins

### Display Order
- ✅ Start from 1 (or 0)
- ✅ Use increments of 1 or 10
- ✅ Lower numbers appear first
- ✅ Order from most common to least common

### Assignments
- ✅ Only assign relevant options to each product
- ✅ Don't over-complicate with too many options
- ✅ Test the customer experience after assigning

---

## 🎨 Customer Experience

### What Customers See

When a customer views a product with assigned options:

1. **Product Page**
   - Base price displayed
   - All assigned options shown
   - Required options marked with *
   - Price updates in real-time as they select

2. **Option Selection**
   - Dropdown or radio buttons for each option
   - Price modifier shown next to each choice
   - Total price updates automatically

3. **Add to Cart**
   - Selected options saved with the item
   - Price includes all modifiers
   - Options displayed in cart

4. **Checkout**
   - All options visible in order summary
   - Final price includes all selections

---

## 🔍 Troubleshooting

### "Template not showing on product"
- ✅ Check if template is assigned in Assignments tab
- ✅ Verify template has at least one available value
- ✅ Check if product is active

### "Price not updating"
- ✅ Verify price modifiers are set correctly
- ✅ Check if values are marked as available
- ✅ Clear browser cache and refresh

### "Can't delete template"
- ✅ Remove all assignments first
- ✅ Delete all values for that template
- ✅ Then delete the template

### "Options not in correct order"
- ✅ Check display_order numbers
- ✅ Lower numbers appear first
- ✅ Update and save

---

## 📊 Quick Reference

### Common Option Types

| Type | English Name | Arabic Name | Typical Values |
|------|--------------|-------------|----------------|
| `size` | Size | الحجم | Small, Medium, Large |
| `material` | Material | المادة | Paper, Glossy, Matte |
| `color` | Color | اللون | Full Color, Black & White |
| `quantity` | Quantity | الكمية | 100, 500, 1000 |
| `design` | Design Service | خدمة التصميم | Own Design, Basic, Premium |
| `finish` | Finish | التشطيب | Standard, Laminated, UV |
| `sides` | Printing Sides | جوانب الطباعة | Single Side, Double Side |
| `delivery` | Delivery Time | وقت التسليم | Standard, Express |

### Price Modifier Examples

| Modifier | Effect | Example |
|----------|--------|---------|
| `0` | No change | Base option |
| `+50` | Add 50 SAR | Premium upgrade |
| `+100` | Add 100 SAR | Express delivery |
| `-20` | Reduce 20 SAR | Promotional discount |
| `-10` | Reduce 10 SAR | Bulk discount |

---

## ✅ Checklist for New Product

When adding options to a new product:

- [ ] Identify what options customers need to choose
- [ ] Create templates (if they don't exist)
- [ ] Add all possible values with correct prices
- [ ] Set display order for logical flow
- [ ] Mark required vs optional correctly
- [ ] Assign templates to the product
- [ ] Test on the product page
- [ ] Verify price calculations
- [ ] Check mobile responsiveness
- [ ] Test complete checkout flow

---

## 🎯 Success Metrics

Track these to optimize your options:

- **Most Selected Options**: Which values customers choose most
- **Price Impact**: How modifiers affect average order value
- **Abandonment**: If too many options cause cart abandonment
- **Support Tickets**: If options are confusing customers

---

## 📞 Need Help?

If you encounter issues:

1. Check this guide first
2. Review the troubleshooting section
3. Test in a different browser
4. Clear cache and cookies
5. Contact technical support

---

**Happy Managing! 🎉**

Remember: Well-organized product options lead to:
- ✅ Better customer experience
- ✅ Higher conversion rates
- ✅ Fewer support tickets
- ✅ Increased average order value
