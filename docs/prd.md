# khat-alailan Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
khat-alailan (خط الاعلان)

### 1.2 Website Description

A comprehensive online printing services platform offering custom printing solutions for individuals and businesses. The website provides a wide range of printing products and services with an easy-to-use ordering system.

### 1.3 Language\n
Arabic (RTL layout)

## 2. Technical Stack

### 2.1 Frontend\n\n- React with JavaScript\n- Tailwind CSS for styling
- RTL (Right-to-Left) support for Arabic language
- Drag-and-drop library for image upload (e.g., react-dropzone)
- Animation library for seasonal offers carousel (e.g., Swiper.js or Framer Motion)

### 2.2 Backend

- Node.js\n\n## 3. Core Features
\n### 3.1 Product Categories

- Business cards printing
- packaging offers
- occasions work
- stickers\n  - Rectangular stickers
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
  - Files
  - Engineering plans
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
- blog
  - User interface for browsing blog posts
  - Blog post listing with featured images and excerpts
  - Individual blog post pages with full content
  - Blog categories and tags navigation
  - Search functionality for blog content
- Who We Are (من نحن)
  - User interface displaying company information\n  - Company history and mission
  - Team introduction
  - Values and achievements\n- Portfolio (معرض الأعمال)\n  - User interface showcasing completed projects
  - Project gallery with categories\n  - Project details and descriptions\n- contact and redirect to whatsap or email or facebook
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
\n### 3.4 Home Page Layout and Sections

#### 3.4.1 Main Categories Section (الأقسام الرئيسية)
\n- Display main product categories in card-based grid layout on home page
- Each category card shows:
  - Category icon/image
  - Category name in Arabic
- Clicking on any category card redirects user to the corresponding category product listing page
- Categories displayed include (but not limited to):
  - التغليف والتعبئة (Packaging)\n  - مطبوعات ورقية (Paper Products)
  - طباعة الملصقات (Stickers Printing)
  - طباعة الأكياس (Bags Printing)
  - طباعة بوكسات (Boxes Printing)\n  - العروض والباكجات (Offers and Packages)
- Reference design: image-2.png and image-3.png
\n#### 3.4.2 Services Section on Home Page (قسم الخدمات)\n
- Prominent services section displayed on home page\n- Display maximum 6 service cards in grid layout
- Each service card shows:
  - Service icon/image
  - Service name in Arabic
  - Brief service description (1-2 lines)
  - 'طلب الخدمة' (Request Service) button
- Responsive grid layout: 3 columns on desktop, 2 columns on tablet, 1 column on mobile\n- Section header: 'خدماتنا' (Our Services) with decorative styling
- Clicking on service card or button redirects to full service details page
- Admin controls which services appear on home page and their display order
- Cards have hover effects with subtle elevation
- Consistent card styling matching overall website design

#### 3.4.3 Seasonal Offers Section on Home Page (العروض الموسمية)\n
- **Prominent seasonal offers section displayed on home page with animated carousel**
- **Animation features**:
  - Auto-scrolling carousel with smooth slide transitions
  - Fade-in/fade-out effects between slides
  - Scale animation on hover (subtle zoom effect)
  - Hover pause functionality (carousel stops when user hovers)
  - Navigation arrows (left/right) with smooth appearance on hover
  - Dot indicators at bottom for slide navigation
  - Responsive touch/swipe support for mobile devices
- Configurable animation speed and transition effects
  - Smooth easing functions for natural movement
- **Each offer card displays**:
  - Offer banner image (full-width, high-quality)
  - Offer title in Arabic (bold, prominent)
  - Offer description and discount details (clear, concise)
  - Validity period with start and end dates (formatted as: من [start date] إلى [end date])
  - 'اطلب الآن' (Order Now) button in yellow/orange linking to offer products
- **Section styling**:
  - Section header: 'العروض الموسمية' with decorative styling and icon
  - Full-width carousel container with subtle shadow
  - Card design with rounded corners and hover effects
  - Responsive layout adapting to screen sizes
- Display active offers only (based on current date comparison)
- Click on offer card to view full offer details or redirect to related products
- Admin has full control over which offers appear and their display order
- **Performance optimization**:
  - Lazy loading for offer images
  - Preloading of next/previous slides
  - Smooth transitions without layout shifts
\n#### 3.4.4 Home Page Section Order\n
1. Hero section / Banner\n2. Main Categories Section (الأقسام الرئيسية)
3. Services Section (خدماتنا) - Maximum 6 cards
4. **Seasonal Offers Section (العروض الموسمية) - Animated carousel**
5. Featured products or other content sections

### 3.5 Navigation Bar Enhancement

#### 3.5.1 طلب تسعير (Request Quote) Navigation Item

- **Add new navigation item in main navbar**: 'طلب تسعير' (Request Quote)
- Position in navbar: between main navigation items, prominently displayed
- Clicking on 'طلب تسعير' redirects to dedicated quote request page
- Navbar item styling:
  - Consistent with other navigation items
  - Hover effect matching site design
  - Active state indicator when on quote request page
  - Responsive: visible on desktop, accessible via mobile menu on smaller screens
\n#### 3.5.2 طلب تسعير Page (Request Quote Page)

- **Dedicated page for quote requests, similar to contact us page structure**
- **Page layout**:
  - Page header: 'طلب تسعير' with subtitle explaining the service
  - Introductory text: Brief description encouraging users to request custom quotes
  - Contact information display (optional): phone, email, business hours
\n- **Quote Request Form**:
  - Form fields:\n    1. **الاسم الكامل*** (Full Name): Text input, required
    2. **البريد الإلكتروني*** (Email Address): Email input, required, with email format validation
    3. **رقم الهاتف*** (Phone Number): Tel input, required, with phone format validation
    4. **نوع الخدمة أو المنتج*** (Service/Product Type): Dropdown select or text input, required
       - Options could include main categories or free text entry
    5. **الكمية المطلوبة** (Requested Quantity): Number input, optional
    6. **تفاصيل الطلب*** (Request Details): Textarea, required, placeholder: 'اكتب تفاصيل طلبك هنا...' (Write your request details here...)
    7. **رفع ملفات مرجعية** (Upload Reference Files): File upload with drag-and-drop, optional\n       - Accepted formats: PDF, PNG, JPG, AI, PSD
       - Multiple file upload support
       - Display uploaded file names with remove option
    8. **الميزانية المتوقعة** (Expected Budget): Text input or number input, optional
    9. **الموعد المطلوب للتسليم** (Requested Delivery Date): Date picker, optional
\n  - Form validation:\n    - All required fields marked with red asterisk (*)
    - Real-time validation with error messages in Arabic
    - Email format validation
    - Phone number format validation
    - Prevent submission until all required fields are valid
\n  - Form actions:
    - 'إرسال الطلب' (Submit Request) button - primary yellow/orange button
    - 'إعادة تعيين' (Reset) button - secondary button to clear form
\n- **Form submission handling**:
  - Upon successful submission:\n    + Display success message: 'تم إرسال طلبك بنجاح! سنتواصل معك خلال 24 ساعة' (Your request has been sent successfully! We will contact you within 24 hours)\n    + Send confirmation email to customer with request details
    + Send notification to admin with quote request details
    + Clear form fields after successful submission
  - Upon submission failure:
    + Display error message: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' (An error occurred while sending the request. Please try again.)\n    + Keep form data intact for user to retry\n\n- **Additional page elements**:
  - Contact information section: Display phone, email, WhatsApp link for direct contact
  - FAQ section (optional): Common questions about quote requests
  - Estimated response time notice: 'نقوم بالرد على جميع الطلبات خلال 24 ساعة' (We respond to all requests within 24 hours)
\n- **Page styling**:
  - Clean, professional layout matching overall site design
  - Card-based form design with subtle shadow\n  - Responsive layout: single column on mobile, optimized spacing on desktop
  - Clear visual hierarchy with section headers
  - Consistent color scheme (yellow/orange for CTAs, blue for links)

### 3.6 E-commerce Features

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

### 3.7 Shopping Cart and Checkout Flow

#### 3.7.1 Shopping Cart Page\n- Display all items added to cart with:\n  - Product image
  - Product name and model number
  - Selected configuration options (size, paper type, quantity, design service, duration, sample request)
  - Unit price and total price per item
  - Quantity adjustment controls (+/-)
  - Remove item button (trash icon)
- Cart summary showing:
  - Subtotal (مجموع فرعي)
  - Shipping cost (تكلفة الشحن)
  - Tax (15% VAT) (ضريبة القيمة المضافة)
  - Total amount (الإجمالي)
-'إتمام الطلب' (Complete Order) button to proceed to checkout
- 'متابعة التسوق' (Continue Shopping) button to return to products\n- **Cart Functionality Fixes**:
  - Ensure cart state persists across page navigation
  - Fix quantity update functionality to correctly recalculate totals
  - Fix remove item functionality to properly update cart state
  - Ensure cart displays correct product configurations
  - Fix cart total calculation including all taxes and fees
  - Add loading states for cart operations
  - Display empty cart message when no items: 'Your Cart is Empty' with'Browse Products' button
  - Implement proper error handling for cart operations

#### 3.7.2 Checkout Process (إتمام الطلب)\n- **Step 1: Customer Information**
  - Full name (required)
  - Email address (required, with email format validation)\n  - Phone number (required, with phone format validation)
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
    2. **Cash on Delivery (الدفع عند الاستلام)**:
       - No additional fields required
       - Display confirmation message about cash payment upon delivery
\n- **Step 3: Order Review**
  - Display order summary with all items and total
  - Display customer information
  - Display selected payment method
  - 'تأكيد الطلب' (Confirm Order) button
\n#### 3.7.3 Order Confirmation and Messages
- **Successful Order**:
  - Display success message: 'تم تأكيد طلبك بنجاح!' (Your order has been confirmed successfully!)
  - Show order number and estimated delivery date
  - Send confirmation email to customer
  - Option to view order details or return to home page

- **Failed Order**:
  - Display error message: 'فشلت عملية الطلب. يرجى المحاولة مرة أخرى.' (Order failed. Please try again.)
  - Show specific error reason if available (e.g., payment declined, invalid card)\n  - Option to retry payment or contact support

#### 3.7.4 Validation Requirements
- All required fields must be filled before proceeding to next step
- Email format validation (must contain @ and domain)
- Phone number format validation (numeric, appropriate length)
- Card number validation (numeric, 16 digits, Luhn algorithm check)
- CVV validation (numeric, 3-4 digits)\n- Expiry date validation (must be future date)
- Display clear error messages in Arabic for each validation failure
- Prevent form submission until all validations pass

### 3.8 Seasonal Offers Management

#### 3.8.1 User Interface - Seasonal Offers Display
- **Prominent animated section on home page displaying seasonal offers**
- **Animated carousel/slider showcasing current seasonal promotions**
- **Animation features**:
  - Auto-scrolling carousel with smooth slide transitions (configurable speed: 3-5 seconds per slide)
  - Fade-in/fade-out effects between slides with opacity transitions
  - Scale animation on hover (1.05x zoom) with smooth transform\n  - Hover pause functionality (carousel stops on mouseenter, resumes on mouseleave)
  - Navigation arrows (chevron left/right) appearing on hover
  - Dot indicators centered below carousel for manual navigation
  - Responsive touch/swipe support for mobile devices using touch events
  - Smooth easing functions (ease-in-out) for natural movement
  - Preloading of adjacent slides for seamless transitions
- **Each offer card displays**:
  - Offer banner image (high-resolution, optimized for web)
  - Offer title in Arabic (large, bold font)
  - Offer description and discount details (clear percentage or amount off)
  - Validity period formatted as: 'من [start date] إلى [end date]'
  - 'اطلب الآن' (Order Now) button in yellow/orange with hover effect
- **Section styling**:
  - Section header: 'العروض الموسمية' with decorative icon and underline
  - Full-width carousel container with subtle box shadow
  - Rounded corners (12px) on offer cards
  - Gradient overlay on images for text readability
  - Responsive breakpoints for different screen sizes
- Display active offers only (filtered by current date between start and end dates)
- Click on offer card to view full offer details or redirect to related products
- **Performance optimization**:
  - Lazy loading for offer images
  - CSS transforms for smooth animations (GPU-accelerated)
  - Debounced resize handlers for responsive behavior
\n#### 3.8.2 Admin Interface - Seasonal Offers Management\n- **Dedicated 'عروض موسمية' (Seasonal Offers) section in admin dashboard sidebar**
- **View All Offers**:
  - List all seasonal offers in data table format with pagination
  - Display columns: \n    + Offer title (sortable)
    + Validity period (start date - end date)
    + Status badge (active/inactive/expired with color coding)
    + Display order/priority (sortable)
    + Actions (edit, delete, toggle status)
  - Filter options: 
    + Active offers (currently running)
    + Inactive offers (manually disabled)
    + Expired offers (past end date)
    + All offers\n  - Search functionality by offer title with real-time filtering
  - Bulk actions: activate, deactivate, delete multiple offers
- **Add New Seasonal Offer**:
  - Form with fields:
    + **عنوان العرض*** (Offer title): Text input, required, Arabic text, max 100 characters
    + **وصف العرض*** (Offer description): Textarea, required, max 500 characters
    + **نسبة أو قيمة الخصم** (Discount percentage or amount): Number input, optional, with unit selector (% or ر.س)
    + **صورة بانر العرض*** (Offer banner image): Drag-and-drop image upload, required
      - Accepted formats: JPG, PNG, WebP\n      - Recommended dimensions: 1200x600px
      - Max file size: 2MB
      - Image preview with crop/resize option
    + **تاريخ البداية*** (Start date): Date picker, required, cannot be past date
    + **تاريخ النهاية*** (End date): Date picker, required, must be after start date
    + **المنتجات/الفئات المرتبطة** (Related products/categories): Multi-select dropdown, optional
      - Search and select from existing products/categories
      - Display selected items with remove option
    + **ترتيب العرض** (Display order/priority): Number input, optional, default: 0
      - Lower numbers appear first in carousel
    + **عرض في الصفحة الرئيسية** (Show on home page): Toggle switch, default: ON
    + **الحالة** (Active/inactive status): Toggle switch, default: Active
  - Form validation:
    + All required fields marked with red asterisk\n    + Real-time validation with error messages\n    + End date must be after start date validation
    + Image file size and format validation
  - **Preview option**: Button to preview how offer will appear on user interface in modal
  - 'حفظ العرض' (Save Offer) button - primary action
  - 'إلغاء' (Cancel) button - secondary action
- **Edit Existing Offer**:
  - Same form as add offer, pre-populated with existing data
  - All fields editable\n  - Image replacement option with current image preview
  - 'تحديث العرض' (Update Offer) button
  - 'إلغاء' (Cancel) button
- **Delete Offer**:
  - Delete button (trash icon) with confirmation dialog
  - Confirmation message: 'هل أنت متأكد من حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء.' (Are you sure you want to delete this offer? This action cannot be undone.)
  - Soft delete option: Archive offers instead of permanent deletion
  - Archived offers can be restored from archive section
- **Offer Status Management**:
  - Automatic status update based on validity dates:\n    + Active: current date is between start and end dates AND manually set to active
    + Expired: current date is past end date\n    + Inactive: manually disabled by admin
  - Manual toggle to activate/deactivate offers (quick action in table)
  - Status indicators:\n    + Green badge for active offers
    + Red badge for expired offers
    + Gray badge for inactive offers
  - Bulk status change: select multiple offers and change status at once
- **Display Order Management**:
  - Drag-and-drop interface to reorder offers in carousel
  - Number input for precise order control
  - Preview button to see carousel order before saving
- **Analytics Dashboard** (optional):
  - View offer performance metrics:\n    + Total views (impressions)
    + Click-through rate (CTR)
    + Conversions (orders from offer)
    + Revenue generated
  - Date range filter for analytics
  - Export analytics data to CSV
  - Track which offers generate most orders
  - Comparison between different offers

### 3.9 Services Section

#### 3.9.1 User Interface - Services Page
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
    + Email address (required)\n    + Phone number (required)\n    + Service details/requirements (text area, required)
    + File upload option for relevant documents
  - 'إرسال الطلب' (Submit Request) button
- Upon service request submission:
  - Display success message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً' (Your request has been sent successfully! We will contact you soon)
  - Send notification message to admin containing:\n    + Service name
    + Customer information
    + Service requirements
  - Send confirmation email to customer
\n#### 3.9.2 Admin Interface - Services Management
- Services management section in admin dashboard
- Add new services with:\n  - Service name (required)
  - Service description (required)
  - Service icon/image upload with drag-and-drop
  - Pricing information (optional)
  - Service features list
  - Show on home page toggle (control if service appears in home page services section)
  - Display order/priority for home page (number input)
  - Active/inactive status toggle
- Edit existing services\n- Delete services
- **Home Page Display Control**:
  - Maximum 6 services can be shown on home page
  - Admin selects which services appear on home page via toggle
  - Admin sets display order/priority for home page services
  - If more than 6 services are marked for home page, system shows top 6 by priority
- View all service requests with:
  - Request date and time
  - Customer information
  - Service name
  - Service requirements
  - Request status (new, in progress, completed, cancelled)
- Update service request status
- Respond to service requests via email or phone
- Filter and search service requests
\n### 3.10 Additional Features

- Contact form\n- Customer support chat
- FAQ section
- Delivery information
- Company information pages
\n### 3.11 Admin Dashboard

- Full control and management of all website content
\n#### 3.11.1 Category Management
- View all product categories\n- Add new categories\n- Edit existing categories
- Delete categories
- Organize category hierarchy
- Manage category icons/images for home page display

#### 3.11.2 Product Management - Add/Edit Product Interface
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
  - All prices formatted to 2 decimal places with'ر.س' currency\n
**Section 2: Quantity Options with Pricing (خيارات الكمية والأسعار)**
- Card layout with header 'خيارات الكمية والأسعار'
- Description: 'أضف خيارات كمية مختلفة مع أسعارها (مثال: 100 نسخة بسعر 1500 ريال، 500 نسخة بسعر 6000 ريال)'
- Dynamic quantity rows, each row contains:
  1. **الكمية *** (Quantity): Number input, required, placeholder: 'مثال: 100', with black border
  2. **السعر (ر.س) *** (Price): Number input, required, placeholder: 'مثال: 1500', with black border
  3. **الإجمالي شامل الضريبة** (Total with Tax): Display-only field showing calculated total (price +15% VAT) in yellow/orange color, formatted to 2 decimals with 'ر.س'\n  4. Remove button (X icon) - red destructive variant, only shown if more than 1 row exists
- Each row has gray background (bg-gray-50) with border and padding
- 'إضافة خيار كمية آخر' button with Plus icon to add new quantity row
- Info note with blue background: '💡 ملاحظة: هذه الخيارات ستظهر للعميل ليختار الكمية المناسبة مع السعر المحدد لكل كمية.'

**Section 3: Size Options with Additional Pricing (خيارات المقاس مع الأسعار الإضافية)**
- Card layout with header 'خيارات المقاس مع الأسعار الإضافية'
- Label: 'المقاسات المتاحة والسعر الإضافي'
- Dynamic size option rows, each row contains:
  1. **اسم المقاس** (Size Name): Text input, placeholder: 'اسم المقاس X', flex-1
  2. **السعر الإضافي** (Additional Price): Number input, placeholder: 'السعر الإضافي', width: w-32\n  3. Currency label: 'ر.س'\n  4. Remove button (X icon) - red destructive variant\n- '+ إضافة مقاس آخر' button to add new size option
\n**Section 4: Paper Type Options with Additional Pricing (خيارات نوع الورق مع الأسعار الإضافية)**
- Same structure as Size Options section
- Card layout with header 'خيارات نوع الورق مع الأسعار الإضافية'
- Label: 'أنواع الورق المتاحة والسعر الإضافي'
- Dynamic paper type option rows with:
  1. Paper type name input
  2. Additional price input
  3. Currency label\n  4. Remove button\n- '+ إضافة نوع ورق آخر' button\n
**Section 5: Design Service Options with Additional Pricing (خيارات خدمة التصميم مع الأسعار الإضافية)**
- Same structure as previous option sections
- Card layout with header 'خيارات خدمة التصميم مع الأسعار الإضافية'
- Dynamic design service option rows\n- '+ إضافة خيار تصميم آخر' button

**Section 6: Implementation Duration Options with Additional Pricing (خيارات مدة التنفيذ مع الأسعار الإضافية)**
- Same structure as previous option sections\n- Card layout with header 'خيارات مدة التنفيذ مع الأسعار الإضافية'
- Dynamic duration option rows
- '+ إضافة مدة تنفيذ أخرى' button
\n**Section 7: Sample Request Options with Additional Pricing (خيارات تصوير العينة مع الأسعار الإضافية)**
- Same structure as previous option sections\n- Card layout with header 'خيارات تصوير العينة مع الأسعار الإضافية'\n- Dynamic sample option rows
- '+ إضافة خيار عينة آخر' button\n
**Section 8: Product Images (صور المنتج)**\n- Card layout with drag-and-drop image upload zone
- Support multiple image uploads\n- Image preview with remove option
- Accepted formats: JPG, PNG, WebP
\n**Form Actions:**
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
\n#### 3.11.3 Blog Management
- View all blog posts
- Create new blog posts
- Edit existing blog posts
- Delete blog posts
- Manage blog categories and tags
- Schedule blog post publication
\n#### 3.11.4 Order Management
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
- **Quote Request Management**:
  - View all quote requests from'طلب تسعير' page
  - Display quote request details:\n    + Customer name, email, phone
    + Service/product type requested
    + Quantity and budget
    + Request details and uploaded files
    + Requested delivery date
  - Update quote request status (new, in progress, quoted, completed, cancelled)
  - Respond to quote requests via email or phone
  - Generate and send custom quotes to customers
  - Track quote conversion to orders

#### 3.11.5 Message Management
- View all customer messages and inquiries
- Respond to customer messages\n- Mark messages as read/unread
- Archive or delete messages\n- Filter messages by status or date
- **Service Request Notifications**:
  - Receive notifications for new service requests
  - Notification includes service name and customer details
  - Quick access to full service request information
- **Quote Request Notifications**:
  - Receive notifications for new quote requests from 'طلب تسعير' page
  - Notification includes customer name and request summary
  - Quick link to view full quote request details
\n#### 3.11.6 User Management
- Manage user accounts\n- View user activity and order history
\n#### 3.11.7 Portfolio Management (إدارة معرض الأعمال)\n- Add new portfolio projects with drag-and-drop image upload
- Edit existing portfolio projects
- Delete portfolio projects
- Categorize projects by type (special occasions, commercial, etc.)
- Manage project details (title, description, images, date)
- Control visibility of portfolio items on user interface

#### 3.11.8 Who We Are Management (إدارة من نحن)\n- Edit company information and history
- Update team member profiles
- Manage company values and achievements
- Upload and update company images
\n#### 3.11.9 Special Occasions Works Management (إدارة مناسباتك الخاصة)
- Add new special occasion projects with multiple images
- Edit project details and descriptions
- Delete projects
- Organize projects by occasion type
- Control display order on user interface

#### 3.11.10 Settings and Configuration
- Configure payment and delivery settings
- Update website content and information
- View sales reports and analytics
- Manage shipping costs and delivery zones
\n## 4. Design Style\n
- Two interfaces: User interface for customers and Admin dashboard for website management
\n### 4.1 Color Scheme

- Primary color: Yellow (أصفر) - used for CTAs, active states, and highlights
- Secondary color: Blue (أزرق) - used for links, secondary actions, and accents
- Complementary neutral tones for balance (grays, whites)\n- Status colors: Green for success/active, Red for errors/expired, Gray for inactive

### 4.2 Visual Elements

- Modern and clean interface with RTL layout
- Card-based product display with hover effects (subtle elevation and scale)
- Card-based category display on home page with icons and labels
- Card-based services display on home page (maximum 6 cards) with hover effects
- **Animated carousel for seasonal offers with smooth transitions and hover effects**
- Rounded corners (8-12px) for buttons and cards
- Subtle shadows for depth and hierarchy (box-shadow with low opacity)
- Clear typography optimized for Arabic text (readable font sizes, appropriate line heights)
- Responsive grid layout for product categories, services section, and main categories section
- Drag-and-drop zone withdashed border and upload icon for image uploads
- Product configuration panel with tabbed interface (orange active tab, gray inactive tab)
- Dropdown fields with downward arrow indicators and price display beside each option
- File upload button with outlined style\n- Orange call-to-action buttons for'Add to Cart', 'Complete Order', 'Submit Request'\n- Required field indicators with red asterisks\n- Error message styling in red with clear visibility and icon
- Success message styling in green with checkmark icon
- Scrolling hero section with smooth transitions for celebrations page
- Gallery-style layout for portfolio and special occasions pages with lightbox functionality
- Social login buttons with brand colors (Google and Facebook)
- Profile page with clean card-based layout for user information sections
- Admin dashboard with sidebar navigation and data tables
- **Seasonal Offers Animation Effects**:
  - Smooth slide transitions with fade effects (opacity 0 to 1)
  - Subtle scale animation on hover (transform: scale(1.05))
  - Auto-play carousel with configurable speed (3-5 seconds)
  - Pause on hover functionality
  - Responsive touch gestures for mobile (swipe left/right)
  - Navigation arrows with smooth appearance (fade in on hover)
  - Dot indicators with active state highlighting
- **Admin Product Form Styling**:
  - Card-based sections with clear headers and spacing
  - Gray backgrounds (bg-gray-50, bg-gray-100) for calculated price displays
  - Black borders on input fields in quantity section
  - Yellow/orange (brand-yellow) color for total price displays
  - Blue info boxes for helper notes
  - Consistent spacing and padding across all sections
  - Responsive two-column grid for form fields
  - Icon buttons (Plus, X) for add/remove actions
- **Quote Request Page Styling**:
  - Clean form layout with card design
  - Consistent field styling matching overall site design
  - Clear section headers and spacing
  - Drag-and-drop file upload zone with visual feedback
  - Yellow/orange primary button for form submission
  - Responsive single-column layout on mobile
\n### 4.3 Layout Style

- Grid-based product catalog\n- Grid-based main categories section on home page (الأقسام الرئيسية)
- Grid-based services section on home page (maximum 6 cards,3 columns desktop, 2 columns tablet, 1 column mobile)
- **Full-width animated carousel for seasonal offers section with smooth transitions**
- Sticky navigation header with 'طلب تسعير' navigation item
- Clear call-to-action buttons in yellow/orange
- Blue accents for links and secondary actions
- Two-column product detail layout: product image on left, configuration options on right
- Hero section with auto-scrolling carousel for celebrations page
- Masonry or grid layout for portfolio displays
- Multi-step checkout layout with progress indicator
- Responsive cart summary sidebar\n- Centered authentication forms with social login buttons below main form
- Profile page with sidebar navigation and main content area
- Admin dashboard with collapsible sidebar and main content area
- **Seasonal Offers Section Layout**:
  - Full-width carousel section on home page
  - Prominent placement after services section and before featured products
  - Responsive card layout within carousel
  - Navigation controls positioned at carousel edges (left/right arrows)
  - Dot indicators centered below carousel
  - Smooth transitions between slides
- **Admin Product Form Layout**:
  - Vertical card stack layout for different sections
  - Each section in separate card component
  - Responsive grid within cards (1 column mobile, 2 columns desktop)
  - Dynamic rows for quantity and option inputs
  - Consistent button placement (add buttons at bottom of each section)
  - Form actions (Save/Cancel) at bottom of entire form
- **Quote Request Page Layout**:
  - Centered page layout with max-width container
  - Page header with title and description
  - Single-column form layout for clarity
  - Contact information section below form
  - Responsive design adapting to all screen sizes
\n## 5. Reference Images

1. Product configuration interface reference: image.png
2. Home page main categories section reference: image-2.png, image-3.png
\n## 6. Reference Files

1. Research Report: /workspace/app-7xukyn3fda82/docs/report.md