# khat-alailan Website Requirements Document

## 1. Website Overview

### 1.1 Website Name\n
khat-alailan (خط الاعلان)

### 1.2 Website Description

A comprehensive online printing services platform offering custom printing solutions for individuals and businesses. The website provides a wide range of printing products and services with an easy-to-use ordering system.

### 1.3 Language

Arabic (RTL layout)

## 2. Technical Stack

### 2.1 Frontend

- React with JavaScript
- Tailwind CSS for styling\n- RTL (Right-to-Left) support for Arabic language\n- Drag-and-drop library for image upload (e.g., react-dropzone)
\n### 2.2 Backend

- Node.js

## 3. Core Features

### 3.1 Product Categories

- Business cards printing
- packaging offers
- occasions work
- stickers
  - Rectangular stickers
  - Custom-shaped stickers - cut to the border
  - Sheet stickers
  - 3D stickers
  - Spot UV stickers
  - Shipping and sealing stickers\n  - Square stickers
  - Round stickers
- Brochures and flyers\n- Printing on bags
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
  - Serving box\n  - Distribution boxes
  - Inner box bases
  - Box holder
- Banners and posters
- paper products
  - Files
  - Engineering plans
  - Envelopes
  - Business cards
  - Tags
  - Correspondence envelopes\n  - Covering paper
  - Menu
  - Brochures
  - Flyers
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
  - Box wrapping
  - Fabric clothing labels
  - Gift ribbons
- Stationery items
- cartons
  - White shipping cartons
  - Brown shipping cartons
  - Thermal seal cartons
  - Full print cartons - Minimum order 1000
- Custom printing services

### 3.2 User Features\n
- Product browsing and search
- other bags
  - Shipping bags
  - Cloth bags
  - Plastic bags
  - Kraft bags
  - Coffee bags
- Custom design upload
- advertising gifts
  - T-shirt
  - Brooch
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
  - Cups
  - Other Printed Materials
  - Pizza Box\n- Shopping cart functionality
- fachions
  - Schools and universities
  - Corporate and employee attire
  - Sports and event wear
  - Professional and service clothing
  - Printed fabric accessories
- Order placement and tracking
- celebrations and occaisons
  - Hero section with scrolling carousel showcasing featured celebration products and services
  - All event supplies
  - Stickers
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
  - User interface displaying company information
  - Company history and mission
  - Team introduction\n  - Values and achievements
- Portfolio (معرض الأعمال)
  - User interface showcasing completed projects
  - Project gallery with categories\n  - Project details and descriptions
- contact and redirect to whatsap or email or facebook
- login with user or admin if user rediret to home page and of he admin redirect to admindashboard

### 3.3 E-commerce Features

- Product catalog with images and descriptions
- Pricing display
- Quantity selection
- Size and material options
- Add to cart functionality\n- Checkout process
- Payment integration
- Order confirmation\n- Each product has the following options before adding to cart (with dynamic pricing based on selections):
  - **الحجم** (Size): اختر
  - **الجانب** (Side): اختر
  - **المادة** (Material): اختر\n  - **الكمية** (Quantity): اختر
  - **خدمة التصميم** (Design Service): لديك نموذج لتصميم خاص أم تريد خدمة تصميم
  - **مدة التنفيذ للمنتج** (Implementation Duration): اختر
  - **هل تريد تصوير عينة قبل طباعة الكمية** (Do you want a sample before full production): اختر (نعم/لا)
  - Price changes dynamically based on user selections
  - Admin manages all option values and pricing rules
- menu

### 3.4 Additional Features

- Contact form
- Customer support chat\n- FAQ section
- Delivery information
- Company information pages

### 3.5 Admin Dashboard

- Full control and management of all website content

#### 3.5.1 Category Management\n- View all product categories
- Add new categories
- Edit existing categories
- Delete categories\n- Organize category hierarchy

#### 3.5.2 Product Management
- Add new products with drag-and-drop image upload
- Edit existing products with drag-and-drop image replacement
- Remove products
- Configure product options (size, material, quantity, design service, implementation duration, sample request)
- Set pricing rules based on product options
- Manage product inventory

#### 3.5.3 Blog Management
- View all blog posts
- Create new blog posts\n- Edit existing blog posts
- Delete blog posts
- Manage blog categories and tags
- Schedule blog post publication

#### 3.5.4 Order Management
- View all orders with filtering options (status, date, customer)
- Update order status (pending, processing, shipped, delivered, cancelled)
- View order details and customer information
- Process refunds and cancellations
- Generate order reports

#### 3.5.5 Message Management
- View all customer messages and inquiries
- Respond to customer messages
- Mark messages as read/unread
- Archive or delete messages
- Filter messages by status or date

#### 3.5.6 User Management
- Manage user accounts
- View user activity and order history

#### 3.5.7 Portfolio Management (إدارة معرض الأعمال)\n- Add new portfolio projects with drag-and-drop image upload\n- Edit existing portfolio projects\n- Delete portfolio projects
- Categorize projects by type (special occasions, commercial, etc.)
- Manage project details (title, description, images, date)
- Control visibility of portfolio items on user interface

#### 3.5.8 Who We Are Management (إدارة من نحن)
- Edit company information and history
- Update team member profiles
- Manage company values and achievements
- Upload and update company images
\n#### 3.5.9 Special Occasions Works Management (إدارة مناسباتك الخاصة)\n- Add new special occasion projects with multiple images
- Edit project details and descriptions
- Delete projects
- Organize projects by occasion type
- Control display order on user interface

#### 3.5.10 Settings and Configuration
- Configure payment and delivery settings
- Update website content and information
- View sales reports and analytics

## 4. Design Style

- Two interfaces: User interface for customers and Admin dashboard for website management
\n### 4.1 Color Scheme

- Primary color: Yellow (أصفر)
- Secondary color: Blue (أزرق)
- Complementary neutral tones for balance\n
### 4.2 Visual Elements

- Modern and clean interface with RTL layout
- Card-based product display with hover effects
- Rounded corners (8-12px) for buttons and cards
- Subtle shadows for depth and hierarchy
- Clear typography optimized for Arabic text\n- Responsive grid layout for product categories
- Drag-and-drop zone with dashed border and upload icon for image uploads
- Scrolling hero section with smooth transitions for celebrations page\n- Gallery-style layout for portfolio and special occasions pages with lightbox functionality

### 4.3 Layout Style

- Grid-based product catalog
- Sticky navigation header\n- Clear call-to-action buttons in yellow
- Blue accents for links and secondary actions
- Hero section with auto-scrolling carousel for celebrations page
- Masonry or grid layout for portfolio displays

## 5. Reference Files

1. Research Report: /workspace/app-7xukyn3fda82/docs/report.md