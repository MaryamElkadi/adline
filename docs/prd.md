# khat-alailan Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
khat-alailan (خط الاعلان)

### 1.2 Website Description

A comprehensive online printing services platform offering custom printing solutions for individuals and businesses. The website provides a wide range of printing products and services with an easy-to-use ordering system.

### 1.3 Language\n
Arabic (RTL layout)

## 2. Technical Stack

### 2.1 Frontend

- React with JavaScript
- Tailwind CSS for styling
- RTL (Right-to-Left) support for Arabic language
- Drag-and-drop library for image upload (e.g., react-dropzone)

### 2.2 Backend

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
  - Menu\n  - Brochures
  - Flyers\n  - Certificates of appreciation
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
- **User Profile Page (صفحة الملف الشخصي)**
  - View and edit personal information:\n    + Full name (الاسم الكامل)
    + Email address (البريد الإلكتروني)
    + Phone number (رقم الهاتف)
    + Profile picture upload with drag-and-drop functionality
  - Edit profile details with inline editing or dedicated edit mode
  - View complete order history with:\n    + Order number and date
    + Order status (pending, processing, shipped, delivered, cancelled)
    + Order items with product images and configurations
    + Total amount paid
    + Option to view detailed order information
    + Option to reorder previous orders
  - Manage saved addresses:\n    + Add new shipping addresses
    + Edit existing addresses\n    + Delete addresses
    + Set default shipping address
    + Address fields: street address, city, postal code\n  - Change password functionality:\n    + Current password field (required)
    + New password field (required, minimum 8 characters)
    + Confirm new password field (required, must match new password)
    + Form validation with error messages
  - Account settings:
    + Email notification preferences
    + Language preferences
    + Account deletion option with confirmation dialog
  - Sidebar navigation with sections:
    + معلومات الحساب (Account Information)
    + سجل الطلبات (Order History)
    + العناوين المحفوظة (Saved Addresses)
    + تغيير كلمة المرور (Change Password)
    + الإعدادات (Settings)
  - Responsive card-based layout for each section
  - Success and error messages for all actions
  - Form validation for all input fields
\n### 3.3 Authentication Features

#### 3.3.1 Registration Page (صفحة التسجيل)
- Full name field (required)
- Email address field (required, with email format validation)
- Phone number field (required, with phone format validation)
- Password field (required, minimum 8 characters)
- Confirm password field (required, must match password)
- Terms and conditions checkbox (required)
- 'تسجيل' (Register) button
- **Social Login Options**:
  - 'تسجيل بواسطة Google' (Sign up with Google) button - using OSS Google login method
  - 'تسجيل بواسطة Facebook' (Sign up with Facebook) button\n- Link to login page:'لديك حساب بالفعل؟ تسجيل الدخول' (Already have an account? Login)
- Form validation with error messages for all fields

#### 3.3.2 Login Page (صفحة تسجيل الدخول)
- Email address field (required, with email format validation)
- Phone number field (required, with phone format validation)
- Password field (required)\n- 'تذكرني' (Remember me) checkbox
- 'نسيت كلمة المرور؟' (Forgot password?) link
- 'تسجيل الدخول' (Login) button\n- **Social Login Options**:\n  - 'تسجيل الدخول بواسطة Google' (Login with Google) button - using OSS Google login method\n  - 'تسجيل الدخول بواسطة Facebook' (Login with Facebook) button
- Link to registration page: 'ليس لديك حساب؟ سجل الآن' (Don't have an account? Register now)
- Form validation with error messages\n- **Login Redirect Logic**:
  - If user role is 'user': redirect to home page
  - If user role is 'admin': redirect to admin dashboard
\n### 3.4 Home Page - Main Categories Section (الأقسام الرئيسية)
\n- Display main product categories in card-based grid layout on home page
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
\n### 3.5 E-commerce Features

- Product catalog with images and descriptions
- Pricing display\n- Add to cart functionality
- Checkout process
- Payment integration
- Order confirmation
- **Product Configuration Before Adding to Cart**:
  - Each product page displays configuration options on the right side
  - Product model number displayed at top (رقم الموديل)
  - Two tabs: خيارات المنتج (Product Options - active/orange) and تقييمات المنتج (Product Reviews)\n  - Configuration fields (all required, marked with red asterisk *):
    1. **اختر المقاس*** (Choose Size): Dropdown list showing size options with price beside each option
    2. **اختر نوع الورق*** (Choose Paper Type): Dropdown list showing paper type options with price beside each option
    3. **الكمية*** (Quantity): Dropdown list for quantity selection with price beside each option
    4. **خدمة التصميم*** (Design Service): Dropdown list with options and price beside each option
    5. **مدة التنفيذ للمنتج*** (Implementation Duration): Dropdown list showing duration options with pricing impact beside each option
    6. **هل تريد تصوير عينة قبل طباعة الكمية*** (Do you want a sample before full production): Dropdown with yes/no options and price beside each option if applicable
    7. **ارفع تصميمك*** (Upload Your Design): File upload field with text'يمكنك رفع ملف بصيغة (PDF, PNG, JPG, AI, PSD)' and 'اختر ملف' button
  - Price display at bottom showing total with currency (ر.س) and shipping note
  - **Dynamic Price Calculation**: Total price updates automatically in real-time as user selects different options
  - Orange'إضافة للسلة' (Add to Cart) button at bottom
  - All dropdown fields show'اختر' (Choose) as placeholder
  - Admin manages all option values and pricing rules through dashboard
  - **Form Validation**: All required fields must be filled before adding to cart, with error messages displayed for missing fields

### 3.6 Shopping Cart and Checkout Flow

#### 3.6.1 Shopping Cart Page\n- Display all items added to cart with:
  - Product image
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
- 'متابعة التسوق' (Continue Shopping) button to return to products\n\n#### 3.6.2 Checkout Process (إتمام الطلب)
- **Step 1: Customer Information**
  - Full name (required)
  - Email address (required, with email format validation)\n  - Phone number (required, with phone format validation)
  - Shipping address (required):\n    - Street address
    - City\n    - Postal code
- Order notes (optional)
  - Form validation with error messages for missing or invalid fields
\n- **Step 2: Payment Method Selection**
  - Two payment options:
    1. **Card Payment (الدفع بالبطاقة)**:\n       - Card number field (required, with card number validation)
       - Cardholder name (required)
       - Expiry date (required, MM/YY format)
       - CVV (required, 3-4 digits)
       - Form validation for all card fields
    2. **Cash on Delivery (الدفع عند الاستلام)**:
       - No additional fields required
       - Display confirmation message about cash payment upon delivery

- **Step 3: Order Review**
  - Display order summary with all items and total
  - Display customer information
  - Display selected payment method
  - 'تأكيد الطلب' (Confirm Order) button\n\n#### 3.6.3 Order Confirmation and Messages
- **Successful Order**:
  - Display success message: 'تم تأكيد طلبك بنجاح!' (Your order has been confirmed successfully!)
  - Show order number and estimated delivery date
  - Send confirmation email to customer
  - Option to view order details or return to home page

- **Failed Order**:
  - Display error message: 'فشلت عملية الطلب. يرجى المحاولة مرة أخرى.' (Order failed. Please try again.)
  - Show specific error reason if available (e.g., payment declined, invalid card)\n  - Option to retry payment or contact support

#### 3.6.4 Validation Requirements
- All required fields must be filled before proceeding to next step
- Email format validation (must contain @ and domain)
- Phone number format validation (numeric, appropriate length)
- Card number validation (numeric, 16 digits, Luhn algorithm check)
- CVV validation (numeric, 3-4 digits)\n- Expiry date validation (must be future date)
- Display clear error messages in Arabic for each validation failure
- Prevent form submission until all validations pass

### 3.7 Services Section (قسم الخدمات)\n
#### 3.7.1 User Interface - Services Page
- Dedicated services page accessible from main navigation
- Display available services in card-based grid layout
- Each service card shows:
  - Service icon/image
  - Service name in Arabic
  - Brief service description
  - 'طلب الخدمة' (Request Service) button
- Clicking on service card or button opens service details modal/page with:
  - Full service description
  - Service features and benefits
  - Pricing information (if applicable)
  - Service request form with fields:
    + Customer name (required)
    + Email address (required)\n    + Phone number (required)\n    + Service details/requirements (text area, required)\n    + File upload option for relevant documents
  - 'إرسال الطلب' (Submit Request) button
- Upon service request submission:
  - Display success message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً' (Your request has been sent successfully! We will contact you soon)\n  - Send notification message to admin containing:
    + Service name
    + Customer information
    + Service requirements
  - Send confirmation email to customer
\n#### 3.7.2 Admin Interface - Services Management
- Services management section in admin dashboard
- Add new services with:
  - Service name (required)
  - Service description (required)
  - Service icon/image upload with drag-and-drop
  - Pricing information (optional)
  - Service features list
  - Active/inactive status toggle
- Edit existing services\n- Delete services
- View all service requests with:
  - Request date and time
  - Customer information
  - Service name
  - Service requirements
  - Request status (new, in progress, completed, cancelled)
- Update service request status
- Respond to service requests via email or phone
- Filter and search service requests

### 3.8 Additional Features

- Contact form\n- Customer support chat
- FAQ section
- Delivery information
- Company information pages
\n### 3.9 Admin Dashboard

- Full control and management of all website content
\n#### 3.9.1 Category Management
- View all product categories\n- Add new categories
- Edit existing categories
- Delete categories
- Organize category hierarchy
- Manage category icons/images for home page display

#### 3.9.2 Product Management - Add/Edit Product Interface
\n**Product Form Structure (matching provided code exactly):**

**Section 1: Basic Product Information (معلومات المنتج الأساسية)**
- Card layout with header'معلومات المنتج الأساسية'\n- Fields:
  1. **اسم المنتج *** (Product Name): Text input, required, placeholder: 'مثال: باقة تصميم الشعار الاحترافية'
  2. **وصف المنتج *** (Product Description): Textarea, required, placeholder: 'اكتب وصفاً مفصلاً للمنتج أو الخدمة...', rows: 4
  3. **السعر الأساسي (ر.س) *** (Base Price): Number input, required, placeholder: '1500'
  4. **الفئة *** (Category): Dropdown select, required\n     - Shows'اختر الفئة' as placeholder
     - Populated with available categories from database
     - Display helper text: 'متوفر X فئة' or 'جاري تحميل الفئات...'
\n- **Tax and Total Price Display Section**:
  - Displayed when base price > 0
  - Gray background card (bg-gray-100) with black text
  - Header: 'حساب السعر الأساسي'\n  - Shows:\n    + السعر الأساسي (Subtotal)
    + ضريبة القيمة المضافة (15%) (VAT 15%)
    + الإجمالي (Total) - bold, larger font, with top border
  - All prices formatted to2 decimal places with'ر.س' currency\n
**Section 2: Quantity Options with Pricing (خيارات الكمية والأسعار)**
- Card layout with header 'خيارات الكمية والأسعار'
- Description: 'أضف خيارات كمية مختلفة مع أسعارها (مثال: 100 نسخة بسعر 1500 ريال، 500 نسخة بسعر 6000 ريال)'
- Dynamic quantity rows, each row contains:
  1. **الكمية *** (Quantity): Number input, required, placeholder: 'مثال: 100', with black border
  2. **السعر (ر.س) *** (Price): Number input, required, placeholder: 'مثال: 1500', with black border
  3. **الإجمالي شامل الضريبة** (Total with Tax): Display-only field showing calculated total (price +15% VAT) in yellow/orange color, formatted to 2 decimals with'ر.س'\n  4. Remove button (X icon) - red destructive variant, only shown if more than 1 row exists
- Each row has gray background (bg-gray-50) with border and padding
- 'إضافة خيار كمية آخر' button with Plus icon to add new quantity row
- Info note with blue background: '💡 ملاحظة: هذه الخيارات ستظهر للعميل ليختار الكمية المناسبة مع السعر المحدد لكل كمية.'

**Section 3: Size Options with Additional Pricing (خيارات المقاس مع الأسعار الإضافية)**
- Card layout with header 'خيارات المقاس مع الأسعار الإضافية'
- Label: 'المقاسات المتاحة والسعر الإضافي'
- Dynamic size option rows, each row contains:
  1. **اسم المقاس** (Size Name): Text input, placeholder: 'اسم المقاس X', flex-1
  2. **السعر الإضافي** (Additional Price): Number input, placeholder: 'السعر الإضافي', width: w-32
  3. Currency label: 'ر.س'
  4. Remove button (X icon) - red destructive variant\n- '+ إضافة مقاس آخر' button to add new size option
\n**Section 4: Paper Type Options with Additional Pricing (خيارات نوع الورق مع الأسعار الإضافية)**
- Same structure as Size Options section
- Card layout with header 'خيارات نوع الورق مع الأسعار الإضافية'
- Label: 'أنواع الورق المتاحة والسعر الإضافي'
- Dynamic paper type option rows with:
  1. Paper type name input
  2. Additional price input
  3. Currency label
  4. Remove button\n- '+ إضافة نوع ورق آخر' button\n
**Section 5: Design Service Options with Additional Pricing (خيارات خدمة التصميم مع الأسعار الإضافية)**
- Same structure as previous option sections
- Card layout with header 'خيارات خدمة التصميم مع الأسعار الإضافية'
- Dynamic design service option rows\n- '+ إضافة خيار تصميم آخر' button

**Section 6: Implementation Duration Options with Additional Pricing (خيارات مدة التنفيذ مع الأسعار الإضافية)**
- Same structure as previous option sections
- Card layout with header 'خيارات مدة التنفيذ مع الأسعار الإضافية'
- Dynamic duration option rows\n- '+ إضافة مدة تنفيذ أخرى' button
\n**Section 7: Sample Request Options with Additional Pricing (خيارات تصوير العينة مع الأسعار الإضافية)**
- Same structure as previous option sections
- Card layout with header 'خيارات تصوير العينة مع الأسعار الإضافية'
- Dynamic sample option rows
- '+ إضافة خيار عينة آخر' button\n
**Section 8: Product Images (صور المنتج)**\n- Card layout with drag-and-drop image upload zone
- Support multiple image uploads\n- Image preview with remove option
- Accepted formats: JPG, PNG, WebP\n\n**Form Actions:**
- 'حفظ المنتج' (Save Product) button - primary action, yellow/orange color
- 'إلغاء' (Cancel) button - secondary action\n- Form validation for all required fields before submission
- Success message upon successful save
- Error messages for validation failures

**Technical Implementation Notes:**
- All option sections use same component structure for consistency
- Dynamic array management for adding/removing option rows
- Real-time calculation of totals including15% VAT
- Form state management with React hooks
- Validation on all required fields
- Black borders on quantity/price input fields as specified
- Gray background (bg-gray-50/bg-gray-100) for calculated price displays
- Yellow/orange (brand-yellow) color for total price displays
- Responsive grid layout (grid-cols-1 md:grid-cols-2) for form fields

#### 3.9.3 Blog Management
- View all blog posts
- Create new blog posts
- Edit existing blog posts
- Delete blog posts
- Manage blog categories and tags
- Schedule blog post publication
\n#### 3.9.4 Order Management
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
- **Service Request Orders**:
  - View service request details
  - Service name clearly displayed
  - Customer contact information
  - Service requirements and uploaded files
  - Send notification message to admin when new service request is received

#### 3.9.5 Message Management
- View all customer messages and inquiries
- Respond to customer messages\n- Mark messages as read/unread
- Archive or delete messages
- Filter messages by status or date
- **Service Request Notifications**:
  - Receive notifications for new service requests
  - Notification includes service name and customer details
  - Quick access to full service request information
\n#### 3.9.6 User Management
- Manage user accounts\n- View user activity and order history
\n#### 3.9.7 Portfolio Management (إدارة معرض الأعمال)\n- Add new portfolio projects with drag-and-drop image upload
- Edit existing portfolio projects
- Delete portfolio projects
- Categorize projects by type (special occasions, commercial, etc.)
- Manage project details (title, description, images, date)
- Control visibility of portfolio items on user interface

#### 3.9.8 Who We Are Management (إدارة من نحن)\n- Edit company information and history
- Update team member profiles
- Manage company values and achievements
- Upload and update company images
\n#### 3.9.9 Special Occasions Works Management (إدارة مناسباتك الخاصة)
- Add new special occasion projects with multiple images
- Edit project details and descriptions
- Delete projects
- Organize projects by occasion type
- Control display order on user interface

#### 3.9.10 Settings and Configuration
- Configure payment and delivery settings
- Update website content and information
- View sales reports and analytics
- Manage shipping costs and delivery zones
\n## 4. Design Style\n
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
- Required field indicators with red asterisks\n- Error message styling in red with clear visibility
- Success message styling in green with checkmark icon
- Scrolling hero section with smooth transitions for celebrations page
- Gallery-style layout for portfolio and special occasions pages with lightbox functionality
- Social login buttons with brand colors (Google and Facebook)
- Profile page with clean card-based layout for user information sections
- Admin dashboard with sidebar navigation and data tables
- **Admin Product Form Styling**:
  - Card-based sections with clear headers
  - Gray backgrounds (bg-gray-50, bg-gray-100) for calculated price displays
  - Black borders on input fields in quantity section
  - Yellow/orange (brand-yellow) color for total price displays
  - Blue info boxes for helper notes
  - Consistent spacing and padding across all sections
  - Responsive two-column grid for form fields
  - Icon buttons (Plus, X) for add/remove actions

### 4.3 Layout Style

- Grid-based product catalog\n- Grid-based main categories section on home page (الأقسام الرئيسية)
- Sticky navigation header\n- Clear call-to-action buttons in yellow/orange
- Blue accents for links and secondary actions
- Two-column product detail layout: product image on left, configuration options on right
- Hero section with auto-scrolling carousel for celebrations page
- Masonry or grid layout for portfolio displays
- Multi-step checkout layout with progress indicator
- Responsive cart summary sidebar
- Centered authentication forms with social login buttons below main form
- Profile page with sidebar navigation and main content area
- Admin dashboard with collapsible sidebar and main content area
- **Admin Product Form Layout**:
  - Vertical card stack layout for different sections
  - Each section in separate card component
  - Responsive grid within cards (1 column mobile, 2 columns desktop)
  - Dynamic rows for quantity and option inputs
  - Consistent button placement (add buttons at bottom of each section)
  - Form actions (Save/Cancel) at bottom of entire form
\n## 5. Reference Images

1. Product configuration interface reference: image.png
2. Home page main categories section reference: image-2.png, image-3.png
\n## 6. Reference Files

1. Research Report: /workspace/app-7xukyn3fda82/docs/report.md