/*
# Create Initial Schema for khat-alailan Printing Services

## 1. Plain English Explanation
This migration creates the complete database structure for an Arabic e-commerce printing services platform.
It includes user profiles with role-based access (user/admin), product catalog with categories and customization options,
shopping cart functionality, order management, blog system, and contact messages.

## 2. Tables & Columns

### profiles
- `id` (uuid, primary key, references auth.users) - User identifier
- `username` (text, unique) - Username for login
- `email` (text) - User email
- `phone` (text) - User phone number
- `full_name` (text) - User's full name
- `role` (user_role enum: 'user', 'admin') - User role
- `created_at` (timestamptz) - Account creation timestamp

### categories
- `id` (uuid, primary key) - Category identifier
- `name_ar` (text, not null) - Arabic category name
- `slug` (text, unique) - URL-friendly identifier
- `description_ar` (text) - Arabic description
- `icon` (text) - Icon identifier
- `image_url` (text) - Category image
- `parent_id` (uuid, references categories) - Parent category for subcategories
- `display_order` (integer) - Sort order
- `is_active` (boolean) - Visibility status
- `created_at` (timestamptz) - Creation timestamp

### products
- `id` (uuid, primary key) - Product identifier
- `category_id` (uuid, references categories) - Product category
- `name_ar` (text, not null) - Arabic product name
- `slug` (text, unique) - URL-friendly identifier
- `description_ar` (text) - Arabic description
- `base_price` (numeric) - Starting price
- `image_url` (text) - Main product image
- `images` (jsonb) - Additional images array
- `is_active` (boolean) - Availability status
- `featured` (boolean) - Featured product flag
- `min_quantity` (integer) - Minimum order quantity
- `production_time_days` (integer) - Estimated production time
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### product_options
- `id` (uuid, primary key) - Option identifier
- `product_id` (uuid, references products) - Associated product
- `option_type` (text) - Type (size, material, sides, etc.)
- `option_name_ar` (text) - Arabic option name
- `price_modifier` (numeric) - Price adjustment
- `is_available` (boolean) - Availability status
- `display_order` (integer) - Sort order

### cart_items
- `id` (uuid, primary key) - Cart item identifier
- `user_id` (uuid, references profiles) - Cart owner
- `product_id` (uuid, references products) - Product in cart
- `quantity` (integer) - Item quantity
- `selected_options` (jsonb) - Selected customization options
- `custom_design_url` (text) - Uploaded design file URL
- `notes` (text) - Special instructions
- `created_at` (timestamptz) - Addition timestamp

### orders
- `id` (uuid, primary key) - Order identifier
- `user_id` (uuid, references profiles) - Customer
- `order_number` (text, unique) - Human-readable order number
- `items` (jsonb) - Order items with details
- `total_amount` (numeric) - Total order cost
- `status` (order_status enum) - Order status
- `payment_method` (text) - Payment method used
- `shipping_address` (jsonb) - Delivery address
- `customer_notes` (text) - Customer instructions
- `admin_notes` (text) - Internal notes
- `stripe_session_id` (text) - Payment session ID
- `stripe_payment_intent_id` (text) - Payment intent ID
- `completed_at` (timestamptz) - Completion timestamp
- `created_at` (timestamptz) - Order creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### blog_posts
- `id` (uuid, primary key) - Post identifier
- `author_id` (uuid, references profiles) - Post author
- `title_ar` (text, not null) - Arabic title
- `slug` (text, unique) - URL-friendly identifier
- `content_ar` (text) - Arabic content
- `excerpt_ar` (text) - Short summary
- `featured_image` (text) - Post image
- `is_published` (boolean) - Publication status
- `published_at` (timestamptz) - Publication timestamp
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### contact_messages
- `id` (uuid, primary key) - Message identifier
- `name` (text, not null) - Sender name
- `email` (text, not null) - Sender email
- `phone` (text) - Sender phone
- `subject` (text) - Message subject
- `message` (text, not null) - Message content
- `is_read` (boolean) - Read status
- `created_at` (timestamptz) - Submission timestamp

## 3. Security Changes
- RLS enabled on all tables
- Public tables (categories, products, blog_posts): Read access for all users
- User-specific tables (cart_items, orders): Users can only access their own data
- Admin tables: Full access for admins only
- Contact messages: Insert for all, read for admins only
- First registered user automatically becomes admin

## 4. Notes
- All text content uses Arabic (_ar suffix)
- Prices stored as numeric for precision
- JSONB used for flexible data (options, addresses, order items)
- Cascading deletes configured for data integrity
- Indexes added for performance optimization
*/

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  email text,
  phone text,
  full_name text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_ar text,
  icon text,
  image_url text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_ar text,
  base_price numeric(12,2) NOT NULL DEFAULT 0,
  image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  featured boolean DEFAULT false,
  min_quantity integer DEFAULT 1,
  production_time_days integer DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_options table
CREATE TABLE IF NOT EXISTS product_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  option_type text NOT NULL,
  option_name_ar text NOT NULL,
  price_modifier numeric(12,2) DEFAULT 0,
  is_available boolean DEFAULT true,
  display_order integer DEFAULT 0
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  selected_options jsonb DEFAULT '{}'::jsonb,
  custom_design_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric(12,2) NOT NULL,
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  payment_method text,
  shipping_address jsonb,
  customer_notes text,
  admin_notes text,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  content_ar text,
  excerpt_ar text,
  featured_image text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_product_options_product_id ON product_options(product_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published) WHERE is_published = true;

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_number text;
  counter integer;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM orders;
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::text, 4, '0');
  RETURN new_number;
END;
$$;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create trigger to auto-sync users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create admin helper function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to profiles"
  ON profiles FOR ALL
  USING (is_admin(auth.uid()));

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin(auth.uid()));

-- Products policies (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (is_admin(auth.uid()));

-- Product options policies
CREATE POLICY "Product options are viewable by everyone"
  ON product_options FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product options"
  ON product_options FOR ALL
  USING (is_admin(auth.uid()));

-- Cart items policies
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all cart items"
  ON cart_items FOR SELECT
  USING (is_admin(auth.uid()));

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (is_admin(auth.uid()));

-- Blog posts policies (public read, admin write)
CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (is_published = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  USING (is_admin(auth.uid()));

-- Contact messages policies
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  USING (is_admin(auth.uid()));