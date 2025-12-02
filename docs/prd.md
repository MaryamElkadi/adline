# khat-alailan Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
\nkhat-alailan (خط الاعلان)\n
### 1.2 Website Description

A comprehensive online printing services platform offering custom printing solutions for individuals and businesses. The website provides a wide range of printing products and services with an easy-to-use ordering system.

### 1.3 Language\n
Arabic (RTL layout)

## 2. Technical Stack

### 2.1 Frontend\n
- React with JavaScript
- Tailwind CSS for styling
- RTL (Right-to-Left) support for Arabic language
- Drag-and-drop library for image upload (e.g., react-dropzone)
\n### 2.2 Backend

- Node.js\n\n## 3. Core Features
\n### 3.1 Product Categories

- Business cards printing
- packaging offers
- occasions work
- stickers
  - Rectangular stickers
  - Custom-shaped stickers - cut to the border
  - Sheet stickers
  - 3D stickers
  - Spot UV stickers
  - Shipping and sealing stickers
  - Square stickers
  - Round stickers
- Brochures and flyers
- Printing on bags
- cards
  - Folded cards
  - Square cards
  - Round cards
  - Product holder card
- boxes
  - Box with stand
  - Zipper boxes
  - Base and lid boxes
  - Complete box with closure
  - Serving box
  - Distribution boxes
  - Inner box bases
  - Box holder
- Banners and posters
- paper products
  - Files\n  - Engineering plans
  - Envelopes
  - Business cards
  - Tags
  - Correspondence envelopes
  - Covering paper
  - Menu\n  - Brochures\n  - Flyers
  - Certificates of appreciation
  - Letter paper
  - Printing of booklets and notebooks
  - Calendars
  - Photographs
- Packaging materials
  - Wrapping paper
  - Cup sleeves
  - Cup holders
  - Box sleeves
  - Box wrapping\n  - Fabric clothing labels
  - Gift ribbons
- Stationery items
- cartons
  - White shipping cartons
  - Brown shipping cartons
  - Thermal seal cartons
  - Full print cartons - Minimum order1000\n- Custom printing services
\n### 3.2 User Features

- Product browsing and search
- other bags
  - Shipping bags
  - Cloth bags
  - Plastic bags
  - Kraft bags
  - Coffee bags
- Custom design upload
- advertising gifts
  - T-shirt\n  - Brooch
  - Mugs
  - Printed pens
  - Stamp
  - Roll-up banner
  - Playing cards
- Online design editor
- Seasonal prints
- resturants and coffes
  - Stickers - Labels
  - Boxes and Bags
  - Cups\n  - Other Printed Materials
  - Pizza Box
- Shopping cart functionality
- fachions
  - Schools and universities
  - Corporate and employee attire
  - Sports and event wear
  - Professional and service clothing
  - Printed fabric accessories
- Order placement and tracking
- celebrations and occaisons
  - Hero section with scrolling carousel showcasing featured celebration products and services
  - All event supplies\n  - Stickers
  - Favor boxes
  - Canvas printing
  - Posters
  - Custom cut cards
  - Tags
  - Roll-up banner printing
- مناسباتك الخاصة (Your Special Occasions)
  - Dedicated page displaying portfolio of completed special occasion works
  - Click on each work to view detailed images and project information
  - Gallery-style layout with filtering options by occasion type
- User account management
- Design services
- Order history
- blog\n  - User interface for browsing blog posts
  - Blog post listing with featured images and excerpts
  - Individual blog post pages with full content
  - Blog categories and tags navigation
  - Search functionality for blog content
- Who We Are (من نحن)
  - User interface displaying company information
  - Company history and mission
  - Team introduction
  - Values and achievements
- Portfolio (معرض الأعمال)
  - User interface showcasing completed projects
  - Project gallery with categories\n  - Project details and descriptions
- contact and redirect to whatsap or email or facebook
- login with user or admin if user rediret to home page and of he admin redirect to admindashboard
\n### 3.3 Home Page - Main Categories Section (الأقسام الرئيسية)

- Display main product categories in card-based grid layout on home page
- Each category card shows:
  - Category icon/image
  - Category name in Arabic
- Clicking on any category card redirects user to the corresponding category product listing page
- Categories displayed include (but not limited to):
  - التغليف والتعبئة (Packaging)\n  - مطبوعات ورقية (Paper Products)
  - طباعة الملصقات (Stickers Printing)
  - طباعة الأكياس (Bags Printing)
  - طباعة بوكسات (Boxes Printing)
  - العروض والباكجات (Offers and Packages)
- Reference design: image-2.png and image-3.png
\n### 3.4 E-commerce Features

- Product catalog with images and descriptions
- Pricing display\n- Add to cart functionality
- Checkout process
- Payment integration
- Order confirmation
- **Product Configuration Before Adding to Cart** (matching image.png exactly):
  - Each product page displays configuration options on the right side
  - Product model number displayed at top (رقم الموديل)
  - Two tabs: خيارات المنتج (Product Options - active/orange) and تقييمات المنتج (Product Reviews)\n  - Configuration fields (all required, marked with red asterisk *):
    1. **اختر المقاس*** (Choose Size): Dropdown list showing size options with price beside each option (e.g., '33x48(+10ر.س)')
    2. **اختر نوع الورق*** (Choose Paper Type): Dropdown list showing paper type options with price beside each option (e.g., 'ورق تغليف 92gm ثلجي (+5 ر.س)')
    3. **الكمية*** (Quantity): Dropdown list for quantity selection with price beside each option\n    4. **خدمة التصميم*** (Design Service): Dropdown list with options and price beside each option (e.g., 'طلب خدمة تصميم (+50 ر.س)')
    5. **مدة التنفيذ للمنتج*** (Implementation Duration): Dropdown list showing duration options with pricing impact beside each option (e.g., 'تنفيذ سريع - 3 أيام (+20 ر.س)')
    6. **هل تريد تصوير عينة قبل طباعة الكمية*** (Do you want a sample before full production): Dropdown with yes/no options and price beside each option if applicable
    7. **ارفع تصميمك*** (Upload Your Design): File upload field with text'يمكنك رفع ملف بصيغة (PDF, PNG, JPG, AI, PSD)' and 'اختر ملف' button
  - Price display at bottom showing total with currency (ر.س) and shipping note
  - **Dynamic Price Calculation**: Total price updates automatically in real-time as user selects different options
  - Orange'إضافة للسلة' (Add to Cart) button at bottom
  - All dropdown fields show'اختر' (Choose) as placeholder
  - Admin manages all option values and pricing rules through dashboard
  - **Form Validation**: All required fields must be filled before adding to cart, with error messages displayed for missing fields

### 3.5 Shopping Cart and Checkout Flow

#### 3.5.1 Shopping Cart Page
- Display all items added to cart with:\n  - Product image
  - Product name and model number
  - Selected configuration options (size, paper type, quantity, design service, duration, sample request)
  - Unit price and total price per item
  - Quantity adjustment controls (+/-)
  - Remove item button
- Cart summary showing:
  - Subtotal
  - Shipping cost
  - Total amount
-'إتمام الطلب' (Complete Order) button to proceed to checkout
- 'متابعة التسوق' (Continue Shopping) button to return to products\n\n#### 3.5.2 Checkout Process
- **Step 1: Customer Information**
  - Full name (required)
  - Email address (required, with email format validation)
  - Phone number (required, with phone format validation)
  - Shipping address (required):\n    - Street address
    - City
    - Postal code
  - Order notes (optional)
  - Form validation with error messages for missing or invalid fields
\n- **Step 2: Payment Method Selection**
  - Two payment options:
    1. **Card Payment (الدفع بالبطاقة)**:\n       - Card number field (required, with card number validation)
       - Cardholder name (required)
       - Expiry date (required, MM/YY format)
       - CVV (required, 3-4 digits)
       - Form validation for all card fields
    2. **Cash on Delivery (الدفع عند الاستلام)**:\n       - No additional fields required
       - Display confirmation message about cash payment upon delivery

- **Step 3: Order Review**
  - Display order summary with all items and total
  - Display customer information
  - Display selected payment method
  - 'تأكيد الطلب' (Confirm Order) button\n\n#### 3.5.3 Order Confirmation and Messages
- **Successful Order**:
  - Display success message: 'تم تأكيد طلبك بنجاح!' (Your order has been confirmed successfully!)
  - Show order number and estimated delivery date
  - Send confirmation email to customer
  - Option to view order details or return to home page

- **Failed Order**:
  - Display error message: 'فشلت عملية الطلب. يرجى المحاولة مرة أخرى.' (Order failed. Please try again.)
  - Show specific error reason if available (e.g., payment declined, invalid card)\n  - Option to retry payment or contact support

#### 3.5.4 Validation Requirements
- All required fields must be filled before proceeding to next step
- Email format validation (must contain @ and domain)
- Phone number format validation (numeric, appropriate length)
- Card number validation (numeric, 16 digits, Luhn algorithm check)
- CVV validation (numeric, 3-4 digits)\n- Expiry date validation (must be future date)
- Display clear error messages in Arabic for each validation failure
- Prevent form submission until all validations pass

### 3.6 Additional Features

- Contact form\n- Customer support chat
- FAQ section
- Delivery information
- Company information pages
\n### 3.7 Admin Dashboard

- Full control and management of all website content
\n#### 3.7.1 Category Management
- View all product categories
- Add new categories\n- Edit existing categories
- Delete categories
- Organize category hierarchy
- Manage category icons/images for home page display

#### 3.7.2 Product Management
- Add new products with drag-and-drop image upload
- Edit existing products with drag-and-drop image replacement
- Remove products
- Configure product options:\n  - Size options (المقاس) with individual pricing for each size
  - Paper type options (نوع الورق) with individual pricing for each type
  - Quantity options (الكمية) with individual pricing for each quantity tier
  - Design service options (خدمة التصميم) with individual pricing for each service level
  - Implementation duration options (مدة التنفيذ للمنتج) with individual pricing for each duration
  - Sample request options (تصوير عينة) with individual pricing if applicable
- **Pricing Management**:
  - Set base price for each product
  - Add price modifier (+ or -) for each option choice
  - Preview how prices display in dropdown menus
  - Set pricing rules based on product option combinations
- Manage product inventory
- Set product model numbers
\n#### 3.7.3 Blog Management
- View all blog posts
- Create new blog posts
- Edit existing blog posts
- Delete blog posts
- Manage blog categories and tags
- Schedule blog post publication
\n#### 3.7.4 Order Management
- View all orders with filtering options (status, date, customer, payment method)
- Update order status (pending, processing, shipped, delivered, cancelled)
- View order details including:\n  - Customer-selected product configurations
  - Uploaded design files
  - Customer information
  - Payment method and status
  - Total amount
- Process refunds and cancellations
- Generate order reports
- Mark orders as paid/unpaid for cash on delivery

#### 3.7.5 Message Management
- View all customer messages and inquiries
- Respond to customer messages
- Mark messages as read/unread
- Archive or delete messages
- Filter messages by status or date

#### 3.7.6 User Management
- Manage user accounts
- View user activity and order history
\n#### 3.7.7 Portfolio Management (إدارة معرض الأعمال)\n- Add new portfolio projects with drag-and-drop image upload
- Edit existing portfolio projects
- Delete portfolio projects
- Categorize projects by type (special occasions, commercial, etc.)
- Manage project details (title, description, images, date)
- Control visibility of portfolio items on user interface

#### 3.7.8 Who We Are Management (إدارة من نحن)
- Edit company information and history
- Update team member profiles
- Manage company values and achievements
- Upload and update company images
\n#### 3.7.9 Special Occasions Works Management (إدارة مناسباتك الخاصة)\n- Add new special occasion projects with multiple images
- Edit project details and descriptions
- Delete projects
- Organize projects by occasion type
- Control display order on user interface

#### 3.7.10 Settings and Configuration
- Configure payment and delivery settings
- Update website content and information
- View sales reports and analytics
- Manage shipping costs and delivery zones
\n## 4. Design Style

- Two interfaces: User interface for customers and Admin dashboard for website management
\n### 4.1 Color Scheme

- Primary color: Yellow (أصفر)
- Secondary color: Blue (أزرق)
- Complementary neutral tones for balance
\n### 4.2 Visual Elements

- Modern and clean interface with RTL layout
- Card-based product display with hover effects
- Card-based category display on home page with icons and labels
- Rounded corners (8-12px) for buttons and cards
- Subtle shadows for depth and hierarchy
- Clear typography optimized for Arabic text
- Responsive grid layout for product categories and main categories section
- Drag-and-drop zone withdashed border and upload icon for image uploads
- Product configuration panel with tabbed interface (orange active tab, gray inactive tab)
- Dropdown fields with downward arrow indicators and price display beside each option
- File upload button with outlined style
- Orange call-to-action buttons for'Add to Cart' and 'Complete Order'
- Required field indicators with red asterisks
- Error message styling in red with clear visibility
- Success message styling in green with checkmark icon
- Scrolling hero section with smooth transitions for celebrations page
- Gallery-style layout for portfolio and special occasions pages with lightbox functionality

### 4.3 Layout Style

- Grid-based product catalog\n- Grid-based main categories section on home page (الأقسام الرئيسية)
- Sticky navigation header\n- Clear call-to-action buttons in yellow/orange
- Blue accents for links and secondary actions
- Two-column product detail layout: product image on left, configuration options on right
- Hero section with auto-scrolling carousel for celebrations page
- Masonry or grid layout for portfolio displays
- Multi-step checkout layout with progress indicator
- Responsive cart summary sidebar
\n## 5. Reference Images

1. Product configuration interface reference: image.png
2. Home page main categories section reference: image-2.png, image-3.png
\n## 6. Reference Files

1. Research Report: /workspace/app-7xukyn3fda82/docs/report.md