/*
# Seed Initial Data for khat-alailan

## Plain English Explanation
This migration adds initial sample data for categories and products to demonstrate the platform functionality.
This includes various printing service categories and sample products with Arabic names and descriptions.

## Data Added
- 8 main categories (Business Cards, Stickers, Boxes, Bags, Paper Products, Packaging, Cartons, Advertising Gifts)
- Sample products for each category with realistic pricing
- All content is in Arabic to match the platform language

## Notes
- This is demonstration data for the exhibition/showcase application
- All data has corresponding UI interfaces for CRUD operations in the admin panel
- Users can modify or delete this data through the admin interface
*/

-- Insert Categories
INSERT INTO categories (name_ar, slug, description_ar, display_order, is_active) VALUES
('بطاقات الأعمال', 'business-cards', 'طباعة بطاقات أعمال احترافية بجودة عالية', 1, true),
('الملصقات', 'stickers', 'ملصقات بأشكال وأحجام متنوعة', 2, true),
('العلب والصناديق', 'boxes', 'علب وصناديق مخصصة لجميع الاستخدامات', 3, true),
('الأكياس', 'bags', 'أكياس ورقية وقماشية وبلاستيكية', 4, true),
('المنتجات الورقية', 'paper-products', 'طباعة جميع أنواع المنتجات الورقية', 5, true),
('مواد التغليف', 'packaging', 'مواد تغليف احترافية', 6, true),
('الكراتين', 'cartons', 'كراتين شحن بأحجام مختلفة', 7, true),
('الهدايا الإعلانية', 'promotional-gifts', 'هدايا دعائية مطبوعة', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for products
DO $$
DECLARE
  cat_business_cards uuid;
  cat_stickers uuid;
  cat_boxes uuid;
  cat_bags uuid;
  cat_paper uuid;
  cat_packaging uuid;
  cat_cartons uuid;
  cat_gifts uuid;
BEGIN
  SELECT id INTO cat_business_cards FROM categories WHERE slug = 'business-cards';
  SELECT id INTO cat_stickers FROM categories WHERE slug = 'stickers';
  SELECT id INTO cat_boxes FROM categories WHERE slug = 'boxes';
  SELECT id INTO cat_bags FROM categories WHERE slug = 'bags';
  SELECT id INTO cat_paper FROM categories WHERE slug = 'paper-products';
  SELECT id INTO cat_packaging FROM categories WHERE slug = 'packaging';
  SELECT id INTO cat_cartons FROM categories WHERE slug = 'cartons';
  SELECT id INTO cat_gifts FROM categories WHERE slug = 'promotional-gifts';

  -- Insert Products for Business Cards
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_business_cards, 'بطاقات أعمال عادية', 'standard-business-cards', 'بطاقات أعمال بطباعة عادية على ورق مطفي أو لامع', 50.00, true, true),
  (cat_business_cards, 'بطاقات أعمال فاخرة', 'premium-business-cards', 'بطاقات أعمال فاخرة مع تشطيبات خاصة', 120.00, true, true);

  -- Insert Products for Stickers
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_stickers, 'ملصقات مستطيلة', 'rectangular-stickers', 'ملصقات مستطيلة بأحجام مختلفة', 30.00, true, false),
  (cat_stickers, 'ملصقات دائرية', 'round-stickers', 'ملصقات دائرية بقصات دقيقة', 35.00, true, true),
  (cat_stickers, 'ملصقات ثلاثية الأبعاد', '3d-stickers', 'ملصقات بارزة ثلاثية الأبعاد', 80.00, true, false);

  -- Insert Products for Boxes
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_boxes, 'علب هدايا', 'gift-boxes', 'علب هدايا أنيقة بأحجام متنوعة', 15.00, true, false),
  (cat_boxes, 'علب منتجات', 'product-boxes', 'علب مخصصة لتغليف المنتجات', 25.00, true, true),
  (cat_boxes, 'علب طعام', 'food-boxes', 'علب طعام آمنة ومطبوعة', 20.00, true, false);

  -- Insert Products for Bags
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_bags, 'أكياس ورقية', 'paper-bags', 'أكياس ورقية صديقة للبيئة', 12.00, true, false),
  (cat_bags, 'أكياس قماشية', 'cloth-bags', 'أكياس قماشية قابلة لإعادة الاستخدام', 25.00, true, true),
  (cat_bags, 'أكياس بلاستيكية', 'plastic-bags', 'أكياس بلاستيكية مطبوعة', 8.00, true, false);

  -- Insert Products for Paper Products
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_paper, 'بروشورات', 'brochures', 'بروشورات إعلانية ملونة', 40.00, true, true),
  (cat_paper, 'فلايرات', 'flyers', 'فلايرات دعائية بأحجام مختلفة', 25.00, true, false),
  (cat_paper, 'مجلدات', 'folders', 'مجلدات ملفات احترافية', 35.00, true, false);

  -- Insert Products for Packaging
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_packaging, 'ورق تغليف', 'wrapping-paper', 'ورق تغليف مطبوع بتصاميم مميزة', 18.00, true, false),
  (cat_packaging, 'أكمام أكواب', 'cup-sleeves', 'أكمام أكواب مخصصة', 15.00, true, false);

  -- Insert Products for Cartons
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_cartons, 'كراتين شحن بيضاء', 'white-shipping-cartons', 'كراتين شحن بيضاء بأحجام متعددة', 10.00, true, false),
  (cat_cartons, 'كراتين شحن بنية', 'brown-shipping-cartons', 'كراتين شحن بنية قوية', 8.00, true, false);

  -- Insert Products for Promotional Gifts
  INSERT INTO products (category_id, name_ar, slug, description_ar, base_price, is_active, featured) VALUES
  (cat_gifts, 'أقلام مطبوعة', 'printed-pens', 'أقلام دعائية مطبوعة بشعارك', 5.00, true, false),
  (cat_gifts, 'أكواب مطبوعة', 'printed-mugs', 'أكواب سيراميك مطبوعة', 20.00, true, true),
  (cat_gifts, 'تيشيرتات مطبوعة', 'printed-tshirts', 'تيشيرتات قطنية مطبوعة', 45.00, true, false);

END $$;