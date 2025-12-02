# System Flow Diagrams

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

1. BROWSE PRODUCTS
   ┌──────────────┐
   │   Products   │
   │     Page     │
   └──────┬───────┘
          │
          ▼
2. VIEW PRODUCT DETAILS
   ┌──────────────────────────────────────┐
   │      Product Detail Page             │
   │  ┌────────────────────────────────┐  │
   │  │  Base Price: 100 SAR           │  │
   │  └────────────────────────────────┘  │
   │  ┌────────────────────────────────┐  │
   │  │  Options:                      │  │
   │  │  ○ Design Service              │  │
   │  │    • Ready (+0 SAR)            │  │
   │  │    • Need Edit (+10 SAR) ✓     │  │
   │  │    • Full Design (+250 SAR)    │  │
   │  │                                │  │
   │  │  ○ Size                        │  │
   │  │    • Small (+0 SAR)            │  │
   │  │    • Medium (+20 SAR)          │  │
   │  │    • Large (+50 SAR) ✓         │  │
   │  └────────────────────────────────┘  │
   │  ┌────────────────────────────────┐  │
   │  │  Total: 160 SAR                │  │
   │  │  (100 + 10 + 50)               │  │
   │  └────────────────────────────────┘  │
   │         [Add to Cart]                │
   └──────────────┬───────────────────────┘
                  │
                  ▼
3. VIEW CART
   ┌──────────────────────────────────────┐
   │          Cart Page                   │
   │  ┌────────────────────────────────┐  │
   │  │  Item 1: Business Card         │  │
   │  │  Base: 100 SAR                 │  │
   │  │  Options:                      │  │
   │  │    • Need Edit: +10 SAR        │  │
   │  │    • Large: +50 SAR            │  │
   │  │  Subtotal: 160 SAR             │  │
   │  │  Quantity: 1                   │  │
   │  └────────────────────────────────┘  │
   │  ┌────────────────────────────────┐  │
   │  │  Cart Total: 160 SAR           │  │
   │  └────────────────────────────────┘  │
   │      [Proceed to Checkout]           │
   └──────────────┬───────────────────────┘
                  │
                  ▼
4. CHECKOUT
   ┌──────────────────────────────────────┐
   │        Checkout Page                 │
   │  ┌────────────────────────────────┐  │
   │  │  Shipping Information          │  │
   │  │  • Full Name: [________]       │  │
   │  │  • Phone: [05________]         │  │
   │  │  • Address: [________]         │  │
   │  │  • City: [________]            │  │
   │  │  • Region: [________]          │  │
   │  └────────────────────────────────┘  │
   │  ┌────────────────────────────────┐  │
   │  │  Payment Method                │  │
   │  │  ○ Cash on Delivery ✓          │  │
   │  │  ○ Credit Card                 │  │
   │  └────────────────────────────────┘  │
   │  ┌────────────────────────────────┐  │
   │  │  Order Summary                 │  │
   │  │  Subtotal: 160 SAR             │  │
   │  │  Shipping: Free                │  │
   │  │  Tax (15%): 24 SAR             │  │
   │  │  Total: 184 SAR                │  │
   │  └────────────────────────────────┘  │
   │        [Place Order]                 │
   └──────────────┬───────────────────────┘
                  │
                  ▼
5. ORDER CONFIRMATION
   ┌──────────────────────────────────────┐
   │      Order Success Page              │
   │  ┌────────────────────────────────┐  │
   │  │  ✓ Order Placed Successfully   │  │
   │  │                                │  │
   │  │  Order ID: #12345              │  │
   │  │  Amount: 184 SAR               │  │
   │  │  Payment: Cash on Delivery     │  │
   │  │  Status: Pending               │  │
   │  └────────────────────────────────┘  │
   │     [Continue Shopping]              │
   └──────────────────────────────────────┘
```

## Admin Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

1. LOGIN
   ┌──────────────┐
   │  Admin Login │
   └──────┬───────┘
          │
          ▼
2. ADMIN DASHBOARD
   ┌──────────────────────────────────────┐
   │      Admin Dashboard                 │
   │  • Dashboard                         │
   │  • Products                          │
   │  • Product Options ← NEW             │
   │  • Categories                        │
   │  • Orders                            │
   │  • Users                             │
   └──────────────┬───────────────────────┘
                  │
                  ▼
3. PRODUCT OPTIONS MANAGEMENT
   ┌──────────────────────────────────────────────────────────────┐
   │           Product Options Page                               │
   │  ┌────────────┬────────────┬────────────────┐               │
   │  │ Templates  │   Values   │  Assignments   │               │
   │  └────────────┴────────────┴────────────────┘               │
   │                                                              │
   │  TEMPLATES TAB:                                             │
   │  ┌────────────────────────────────────────────────────┐    │
   │  │  Template List:                                    │    │
   │  │  1. Design Service (design_service) [Edit][Delete] │    │
   │  │  2. Size (size) [Edit][Delete]                     │    │
   │  │  3. Color (color) [Edit][Delete]                   │    │
   │  │                                                    │    │
   │  │  [+ Create Template]                               │    │
   │  └────────────────────────────────────────────────────┘    │
   │                                                              │
   │  VALUES TAB:                                                │
   │  ┌────────────────────────────────────────────────────┐    │
   │  │  Value List:                                       │    │
   │  │  Design Service:                                   │    │
   │  │    • Ready (+0 SAR) [Edit][Delete]                 │    │
   │  │    • Need Edit (+10 SAR) [Edit][Delete]            │    │
   │  │    • Full Design (+250 SAR) [Edit][Delete]         │    │
   │  │                                                    │    │
   │  │  Size:                                             │    │
   │  │    • Small (+0 SAR) [Edit][Delete]                 │    │
   │  │    • Medium (+20 SAR) [Edit][Delete]               │    │
   │  │    • Large (+50 SAR) [Edit][Delete]                │    │
   │  │                                                    │    │
   │  │  [+ Create Value]                                  │    │
   │  └────────────────────────────────────────────────────┘    │
   │                                                              │
   │  ASSIGNMENTS TAB:                                           │
   │  ┌────────────────────────────────────────────────────┐    │
   │  │  Assignment List:                                  │    │
   │  │  Business Card → Design Service [Unassign]         │    │
   │  │  Business Card → Size [Unassign]                   │    │
   │  │  Flyer → Design Service [Unassign]                 │    │
   │  │  Flyer → Size [Unassign]                           │    │
   │  │  Flyer → Color [Unassign]                          │    │
   │  │                                                    │    │
   │  │  [+ Assign Option]                                 │    │
   │  └────────────────────────────────────────────────────┘    │
   └──────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│  product_option_templates    │
├──────────────────────────────┤
│  id (PK)                     │
│  option_type (UNIQUE)        │
│  option_name_ar              │
│  option_name_en              │
│  is_required                 │
│  display_order               │
│  created_at                  │
└──────────┬───────────────────┘
           │
           │ 1:N
           │
           ▼
┌──────────────────────────────┐
│  product_option_values       │
├──────────────────────────────┤
│  id (PK)                     │
│  template_id (FK)            │◄────┐
│  value_ar                    │     │
│  value_en                    │     │
│  price_modifier              │     │
│  is_available                │     │
│  display_order               │     │
│  created_at                  │     │
└──────────────────────────────┘     │
                                     │
┌──────────────────────────────┐     │
│  product_option_assignments  │     │
├──────────────────────────────┤     │
│  id (PK)                     │     │
│  product_id (FK)             │     │
│  template_id (FK)            │─────┘
│  created_at                  │
└──────────┬───────────────────┘
           │
           │ N:1
           │
           ▼
┌──────────────────────────────┐
│  products                    │
├──────────────────────────────┤
│  id (PK)                     │
│  name_ar                     │
│  base_price                  │
│  ...                         │
└──────────────────────────────┘
```

## Price Calculation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   PRICE CALCULATION                                  │
└─────────────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌────────────────────────┐
│  Get Base Price        │
│  price = 100 SAR       │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│  Add Option Modifiers  │
│  For each selected:    │
│  • Design: +10 SAR     │
│  • Size: +50 SAR       │
│  price = 160 SAR       │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│  Calculate Tax (15%)   │
│  tax = 160 * 0.15      │
│  tax = 24 SAR          │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│  Calculate Total       │
│  total = 160 + 24      │
│  total = 184 SAR       │
└──────────┬─────────────┘
           │
           ▼
         END
```

## API Call Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      API CALL FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

PRODUCT DETAIL PAGE LOAD:
┌─────────────────┐
│  Frontend       │
└────────┬────────┘
         │
         │ 1. getProductBySlug(slug)
         ▼
┌─────────────────┐
│  Supabase API   │
└────────┬────────┘
         │
         │ 2. Returns product data
         ▼
┌─────────────────┐
│  Frontend       │
└────────┬────────┘
         │
         │ 3. getProductOptionsByProductId(productId)
         ▼
┌─────────────────┐
│  Supabase API   │
└────────┬────────┘
         │
         │ 4. Returns options with values
         ▼
┌─────────────────┐
│  Frontend       │
│  Displays:      │
│  • Product      │
│  • Options      │
│  • Prices       │
└─────────────────┘

ADD TO CART:
┌─────────────────┐
│  Frontend       │
│  User clicks    │
│  "Add to Cart"  │
└────────┬────────┘
         │
         │ 1. addItem(product, options, quantity)
         ▼
┌─────────────────┐
│  CartContext    │
└────────┬────────┘
         │
         │ 2. INSERT INTO cart_items
         ▼
┌─────────────────┐
│  Supabase DB    │
└────────┬────────┘
         │
         │ 3. Success
         ▼
┌─────────────────┐
│  Frontend       │
│  Shows toast    │
└─────────────────┘

CHECKOUT:
┌─────────────────┐
│  Frontend       │
│  User submits   │
│  checkout form  │
└────────┬────────┘
         │
         │ 1. createOrder(checkoutData, cartItems, userId)
         ▼
┌─────────────────┐
│  Supabase API   │
└────────┬────────┘
         │
         │ 2. BEGIN TRANSACTION
         │    • INSERT INTO orders
         │    • INSERT INTO order_items
         │    • DELETE FROM cart_items
         │    COMMIT
         ▼
┌─────────────────┐
│  Supabase DB    │
└────────┬────────┘
         │
         │ 3. Returns order ID
         ▼
┌─────────────────┐
│  Frontend       │
│  Navigate to    │
│  success page   │
└─────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                                  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│  AuthContext                 │
├──────────────────────────────┤
│  • user                      │
│  • profile                   │
│  • isAdmin                   │
│  • signIn()                  │
│  • signOut()                 │
└──────────────────────────────┘

┌──────────────────────────────┐
│  CartContext                 │
├──────────────────────────────┤
│  • items[]                   │
│  • totalPrice                │
│  • totalItems                │
│  • addItem()                 │
│  • updateItem()              │
│  • removeItem()              │
│  • clearCart()               │
│  • getTotalPrice()           │
└──────────────────────────────┘

┌──────────────────────────────┐
│  ProductDetail State         │
├──────────────────────────────┤
│  • product                   │
│  • productOptions[]          │
│  • selectedOptions{}         │
│  • quantity                  │
│  • notes                     │
│  • calculateTotalPrice()     │
└──────────────────────────────┘

┌──────────────────────────────┐
│  Checkout State              │
├──────────────────────────────┤
│  • shippingAddress{}         │
│  • paymentMethod             │
│  • orderSummary{}            │
│  • isProcessing              │
│  • handleSubmit()            │
└──────────────────────────────┘
```
