/*
# Create Portfolio Table

## Plain English Explanation
This migration creates a portfolio table to showcase completed works and projects.
Portfolios can be categorized by celebration type or project category.

## Tables Created
- `portfolio_items`
  - `id` (uuid, primary key)
  - `title_ar` (text, not null) - Project title in Arabic
  - `description_ar` (text) - Project description
  - `category` (text) - Category/celebration type
  - `image_url` (text) - Main project image
  - `images` (text array) - Additional project images
  - `client_name` (text) - Client name (optional)
  - `completion_date` (date) - Project completion date
  - `is_featured` (boolean, default false)
  - `display_order` (integer, default 0)
  - `created_at` (timestamptz, default now())

## Security
- Public read access for all users
- Admin-only write access
*/

CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  description_ar text,
  category text,
  image_url text,
  images text[] DEFAULT '{}',
  client_name text,
  completion_date date,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public can view all portfolio items
CREATE POLICY "Anyone can view portfolio items" ON portfolio_items
  FOR SELECT USING (true);

-- Only admins can insert portfolio items
CREATE POLICY "Admins can insert portfolio items" ON portfolio_items
  FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Only admins can update portfolio items
CREATE POLICY "Admins can update portfolio items" ON portfolio_items
  FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- Only admins can delete portfolio items
CREATE POLICY "Admins can delete portfolio items" ON portfolio_items
  FOR DELETE TO authenticated
  USING (is_admin(auth.uid()));

-- Add some sample portfolio items
INSERT INTO portfolio_items (title_ar, description_ar, category, image_url, is_featured, display_order) VALUES
('دعوات زفاف فاخرة', 'تصميم وطباعة دعوات زفاف بتصميم عصري وأنيق مع تذهيب فاخر', 'حفلات الزفاف', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', true, 1),
('بطاقات عيد ميلاد للأطفال', 'بطاقات ملونة ومرحة لحفلات أعياد ميلاد الأطفال مع شخصيات كرتونية', 'أعياد الميلاد', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', true, 2),
('شهادات تخرج مميزة', 'شهادات تقدير وتخرج بتصميم احترافي مع إطارات ذهبية', 'التخرج', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', true, 3),
('بطاقات معايدة رمضانية', 'بطاقات معايدة بتصاميم إسلامية راقية لشهر رمضان المبارك', 'المناسبات الدينية', 'https://images.unsplash.com/photo-1589395937658-0e18e4fbb1e1?w=800', true, 4),
('ديكورات حفلات الأطفال', 'مجموعة كاملة من ديكورات وملصقات حفلات الأطفال', 'حفلات الأطفال', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', false, 5),
('جوائز وشهادات تقدير', 'شهادات تقدير وجوائز للمناسبات الرسمية والشركات', 'المناسبات الرسمية', 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800', false, 6);