/*
# Product Options Management System

## 1. New Tables

### `product_option_templates`
- `id` (uuid, primary key)
- `name_ar` (text, not null) - Option name in Arabic (e.g., "المقاس", "نوع الورق")
- `name_en` (text) - Option name in English
- `option_type` (text, not null) - Type identifier (size, paper_type, side, material, design_service, production_time)
- `is_required` (boolean, default true)
- `display_order` (integer, default 0)
- `created_at` (timestamptz, default now())

### `product_option_values`
- `id` (uuid, primary key)
- `template_id` (uuid, references product_option_templates)
- `value_ar` (text, not null) - Option value in Arabic
- `value_en` (text) - Option value in English
- `price_modifier` (decimal, default 0) - Price addition/subtraction
- `display_order` (integer, default 0)
- `created_at` (timestamptz, default now())

### `product_option_assignments`
- `id` (uuid, primary key)
- `product_id` (uuid, references products)
- `template_id` (uuid, references product_option_templates)
- `created_at` (timestamptz, default now())

## 2. Security
- Public read access for all option tables
- Admin-only write access

## 3. Sample Data
- Pre-populate with common options and values
*/

-- Create product_option_templates table
CREATE TABLE IF NOT EXISTS product_option_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text,
  option_type text NOT NULL,
  is_required boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create product_option_values table
CREATE TABLE IF NOT EXISTS product_option_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES product_option_templates(id) ON DELETE CASCADE,
  value_ar text NOT NULL,
  value_en text,
  price_modifier decimal DEFAULT 0,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create product_option_assignments table
CREATE TABLE IF NOT EXISTS product_option_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  template_id uuid REFERENCES product_option_templates(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, template_id)
);

-- Enable RLS
ALTER TABLE product_option_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_assignments ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view option templates" ON product_option_templates
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view option values" ON product_option_values
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view option assignments" ON product_option_assignments
  FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage option templates" ON product_option_templates
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage option values" ON product_option_values
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage option assignments" ON product_option_assignments
  FOR ALL USING (is_admin(auth.uid()));

-- Insert sample option templates
INSERT INTO product_option_templates (name_ar, name_en, option_type, is_required, display_order) VALUES
  ('المقاس', 'Size', 'size', true, 1),
  ('نوع الورق', 'Paper Type', 'paper_type', true, 2),
  ('الكمية', 'Quantity', 'quantity', true, 3),
  ('الجانب', 'Side', 'side', true, 4),
  ('المادة', 'Material', 'material', true, 5),
  ('خدمة التصميم', 'Design Service', 'design_service', true, 6),
  ('مدة التنفيذ للمنتج', 'Production Time', 'production_time', true, 7);

-- Insert sample option values for Size
INSERT INTO product_option_values (template_id, value_ar, value_en, price_modifier, display_order)
SELECT id, '33x48', '33x48', 0, 1 FROM product_option_templates WHERE option_type = 'size'
UNION ALL
SELECT id, '50x70', '50x70', 20, 2 FROM product_option_templates WHERE option_type = 'size'
UNION ALL
SELECT id, 'A4', 'A4', 0, 3 FROM product_option_templates WHERE option_type = 'size'
UNION ALL
SELECT id, 'A5', 'A5', -10, 4 FROM product_option_templates WHERE option_type = 'size';

-- Insert sample option values for Paper Type
INSERT INTO product_option_values (template_id, value_ar, value_en, price_modifier, display_order)
SELECT id, 'ورق تغليف 92 gm ثلجي', 'Glossy wrapping paper 92gm', 0, 1 FROM product_option_templates WHERE option_type = 'paper_type'
UNION ALL
SELECT id, 'ورق مطفي 120 gm', 'Matte paper 120gm', 15, 2 FROM product_option_templates WHERE option_type = 'paper_type'
UNION ALL
SELECT id, 'كرتون 300 gm', 'Cardboard 300gm', 30, 3 FROM product_option_templates WHERE option_type = 'paper_type';

-- Insert sample option values for Quantity
INSERT INTO product_option_values (template_id, value_ar, value_en, price_modifier, display_order)
SELECT id, '100', '100', 0, 1 FROM product_option_templates WHERE option_type = 'quantity'
UNION ALL
SELECT id, '250', '250', 0, 2 FROM product_option_templates WHERE option_type = 'quantity'
UNION ALL
SELECT id, '500', '500', 0, 3 FROM product_option_templates WHERE option_type = 'quantity'
UNION ALL
SELECT id, '1000', '1000', 0, 4 FROM product_option_templates WHERE option_type = 'quantity'
UNION ALL
SELECT id, '2000', '2000', 0, 5 FROM product_option_templates WHERE option_type = 'quantity';

-- Insert sample option values for Side
INSERT INTO product_option_values (template_id, value_ar, value_en, price_modifier, display_order)
SELECT id, 'وجه واحد', 'One side', 0, 1 FROM product_option_templates WHERE option_type = 'side'
UNION ALL
SELECT id, 'وجهين', 'Two sides', 25, 2 FROM product_option_templates WHERE option_type = 'side';

-- Insert sample option values for Material
INSERT INTO product_option_values (template_id, value_ar, value_en, price_modifier, display_order)
SELECT id, 'ورق', 'Paper', 0, 1 FROM product_option_templates WHERE option_type = 'material'
UNION ALL
SELECT id, 'كرتون', 'Cardboard', 20, 2 FROM product_option_templates WHERE option_type = 'material'
UNION ALL
SELECT id, 'فينيل', 'Vinyl', 40, 3 FROM product_option_templates WHERE option_type = 'material';

-- Insert sample option values for Design Service
INSERT INTO product_option_values (template_id, value_ar, value_en, price_modifier, display_order)
SELECT id, 'رفع تصميمي الخاص', 'Upload my own design', 0, 1 FROM product_option_templates WHERE option_type = 'design_service'
UNION ALL
SELECT id, 'لدي تصميم بحاجة تعديل (10 ر.س)', 'I have a design that needs modification', 10, 2 FROM product_option_templates WHERE option_type = 'design_service'
UNION ALL
SELECT id, 'طلب خدمة تصميم (250 ر.س)', 'Request design service', 250, 3 FROM product_option_templates WHERE option_type = 'design_service';

-- Insert sample option values for Production Time
INSERT INTO product_option_values (template_id, value_ar, value_en, price_modifier, display_order)
SELECT id, 'عادي (5-7 أيام)', 'Standard (5-7 days)', 0, 1 FROM product_option_templates WHERE option_type = 'production_time'
UNION ALL
SELECT id, 'سريع (2-3 أيام)', 'Express (2-3 days)', 50, 2 FROM product_option_templates WHERE option_type = 'production_time'
UNION ALL
SELECT id, 'عاجل (24 ساعة)', 'Urgent (24 hours)', 150, 3 FROM product_option_templates WHERE option_type = 'production_time';
