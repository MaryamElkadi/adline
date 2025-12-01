# Admin Dashboard Features

## Overview
Complete admin dashboard with full CRUD operations for managing all aspects of the khat-alailan printing services website.

## Access
- **URL**: `/admin`
- **Requirements**: Admin role required
- **First User**: The first registered user automatically becomes an admin

## Admin Pages

### 1. Dashboard (`/admin`)
- Overview statistics
- Quick access to all management sections
- System status indicators
- Total counts for:
  - Products
  - Categories
  - Orders
  - Users
  - Blog Posts
  - Unread Messages

### 2. Products Management (`/admin/products`)
**Features:**
- ✅ View all products in a table
- ✅ Search products by name
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ **Drag & Drop Image Upload**
- ✅ Set product as active/inactive
- ✅ Mark products as featured
- ✅ Set minimum quantity
- ✅ Set production time
- ✅ Assign categories

**Product Form Fields:**
- Name (Arabic)
- Slug
- Description (Arabic)
- Category
- Base Price
- Image (Drag & Drop or URL)
- Minimum Quantity
- Production Time (Days)
- Active Status
- Featured Status

### 3. Categories Management (`/admin/categories`)
**Features:**
- ✅ View all categories
- ✅ Search categories
- ✅ Add new categories
- ✅ Edit categories
- ✅ Delete categories
- ✅ Set display order
- ✅ Add emoji icons
- ✅ Set active/inactive status

**Category Form Fields:**
- Name (Arabic)
- Slug
- Description (Arabic)
- Icon (Emoji)
- Image URL
- Display Order
- Active Status

### 4. Orders Management (`/admin/orders`)
**Features:**
- ✅ View all orders
- ✅ Search orders by order number
- ✅ View order details
- ✅ Update order status
- ✅ View customer information
- ✅ View shipping address
- ✅ View order items with prices

**Order Statuses:**
- Pending
- Confirmed
- Processing
- Ready
- Shipped
- Delivered
- Cancelled

### 5. Users Management (`/admin/users`)
**Features:**
- ✅ View all users
- ✅ Search users
- ✅ View user roles (Admin/User)
- ✅ View user statistics
- ✅ See registration dates

**User Information:**
- Username
- Full Name
- Email
- Phone
- Role (Admin/User)
- Join Date

### 6. Blog Posts Management (`/admin/blog`)
**Features:**
- ✅ View all blog posts
- ✅ Search posts
- ✅ Add new posts
- ✅ Edit posts
- ✅ Delete posts
- ✅ Publish/unpublish posts
- ✅ Add featured images

**Blog Post Form Fields:**
- Title (Arabic)
- Slug
- Excerpt (Arabic)
- Content (Arabic)
- Featured Image URL
- Published Status

### 7. Messages Management (`/admin/messages`)
**Features:**
- ✅ View all contact messages
- ✅ Search messages
- ✅ View message details
- ✅ Mark as read/unread
- ✅ Delete messages
- ✅ Unread message counter

**Message Information:**
- Name
- Email
- Phone
- Subject
- Message Content
- Read Status
- Date Received

## Image Upload Component

### Features
- ✅ **Drag and Drop** functionality
- ✅ Click to browse files
- ✅ Enter URL manually
- ✅ Image preview
- ✅ Remove image option
- ✅ Loading states
- ✅ File type validation (images only)

### Usage
The image upload component is integrated into:
- Product creation/editing
- Can be easily added to categories and blog posts

### How It Works
1. **Drag & Drop**: Drag an image file onto the upload area
2. **Browse**: Click "Choose File" to select from your computer
3. **URL**: Click "Enter URL" to paste an image URL
4. **Preview**: See the uploaded image immediately
5. **Remove**: Click the X button to remove the image

## Celebrations Scrolling Section

### Features
- ✅ Horizontal scrolling animation
- ✅ Pause on hover
- ✅ Smooth infinite loop
- ✅ Colorful gradient cards
- ✅ Emoji icons for visual appeal

### Celebrations Included
1. **Weddings** 💍 - Invitations, thank you cards, gifts
2. **Birthdays** 🎂 - Cards, stickers, gift boxes
3. **Graduation** 🎓 - Certificates, congratulation cards
4. **Religious Events** 🌙 - Greeting cards, Ramadan gifts
5. **Children's Parties** 🎈 - Decorations, stickers, candy boxes
6. **Official Events** 🏆 - Certificates, awards, souvenirs

### Location
The celebrations section is displayed on the home page between the features section and the categories section.

## Product Options

### Available Options
Products now have customization options that affect pricing:

1. **Size (الحجم)**
   - Small, Medium, Large, Custom
   - Price modifiers: 0, +10, +20, +30 SAR

2. **Quantity (الكمية)**
   - 100, 250, 500, 1000 pieces
   - Price modifiers: 0, +20, +35, +60 SAR

3. **Material (المادة)**
   - Matte, Glossy, Premium
   - Price modifiers: 0, +15, +40 SAR

4. **Sides (الجانب)**
   - Single-sided, Double-sided
   - Price modifiers: 0, +25 SAR

5. **Design Service (خدمة التصميم)**
   - Have own design, Need design service
   - Price modifiers: 0, +50 SAR

6. **Production Time (مدة التنفيذ)**
   - 3 days, 5 days, 7 days
   - Price modifiers: +30, +15, 0 SAR

7. **Sample (عينة قبل الطباعة)**
   - Yes, No
   - Price modifiers: +25, 0 SAR

### How It Works
- Admin adds product options through the database
- Customers select options on product detail page
- Price automatically calculates based on selections
- Selected options are saved with cart items and orders

## Technical Details

### Database Tables
- `profiles` - User accounts and roles
- `categories` - Product categories
- `products` - Product catalog
- `product_options` - Customization options
- `cart_items` - Shopping cart
- `orders` - Customer orders
- `blog_posts` - Blog content
- `contact_messages` - Contact form submissions

### Security
- Row Level Security (RLS) enabled
- Admin-only access to management pages
- Automatic redirect for non-admin users
- Secure API endpoints

### UI Components
- Responsive design for all screen sizes
- RTL (Right-to-Left) layout for Arabic
- Modern card-based interface
- Smooth animations and transitions
- Toast notifications for user feedback

## Navigation

### Admin Sidebar
- Dashboard
- Products
- Categories
- Orders
- Users
- Blog Posts
- Messages
- Back to Website
- Sign Out

### Mobile Support
- Hamburger menu for mobile devices
- Responsive tables
- Touch-friendly interface
- Optimized for tablets and phones

## Future Enhancements

### Potential Features
- Bulk product import/export
- Advanced analytics and reports
- Email notifications for orders
- Product reviews management
- Inventory tracking
- Discount codes and promotions
- Multi-language support
- Advanced search and filters

## Support

For any issues or questions about the admin dashboard:
1. Check the console for error messages
2. Verify admin role is assigned
3. Ensure database connection is active
4. Review API error responses

## Summary

The admin dashboard provides complete control over all aspects of the khat-alailan website:
- ✅ Full CRUD operations for all entities
- ✅ Drag & Drop image upload
- ✅ Order management with status updates
- ✅ User role management
- ✅ Content management (blog posts)
- ✅ Message handling
- ✅ Product options with dynamic pricing
- ✅ Celebrations scrolling section on home page
- ✅ Responsive and user-friendly interface
