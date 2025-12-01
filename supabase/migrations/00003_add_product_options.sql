/*
# Add Product Options

## Plain English Explanation
This migration adds customization options for products including size, quantity, material, 
design service, production time, and sample requirements.

## Data Added
- Size options (Small, Medium, Large, Custom)
- Material options (Matte, Glossy, Premium)
- Design service options (Own design, Need design service)
- Production time options (3 days, 5 days, 7 days)
- Sample options (Yes, No)

## Notes
- Options are added for the first few products as examples
- Each option has a price modifier
*/

-- Get some product IDs
DO $$
DECLARE
  product_id_1 uuid;
  product_id_2 uuid;
  product_id_3 uuid;
BEGIN
  -- Get first three products
  SELECT id INTO product_id_1 FROM products ORDER BY created_at LIMIT 1;
  SELECT id INTO product_id_2 FROM products ORDER BY created_at LIMIT 1 OFFSET 1;
  SELECT id INTO product_id_3 FROM products ORDER BY created_at LIMIT 1 OFFSET 2;

  -- Add options for first product (Business Cards)
  IF product_id_1 IS NOT NULL THEN
    -- Size options
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_1, 'الحجم', 'صغير (5x9 سم)', 0, 1),
    (product_id_1, 'الحجم', 'متوسط (9x5.5 سم)', 10, 2),
    (product_id_1, 'الحجم', 'كبير (10x6 سم)', 20, 3),
    (product_id_1, 'الحجم', 'مخصص', 30, 4);

    -- Quantity options
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_1, 'الكمية', '100 قطعة', 0, 1),
    (product_id_1, 'الكمية', '250 قطعة', 20, 2),
    (product_id_1, 'الكمية', '500 قطعة', 35, 3),
    (product_id_1, 'الكمية', '1000 قطعة', 60, 4);

    -- Material options
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_1, 'المادة', 'ورق مطفي', 0, 1),
    (product_id_1, 'المادة', 'ورق لامع', 15, 2),
    (product_id_1, 'المادة', 'ورق فاخر', 40, 3);

    -- Sides options
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_1, 'الجانب', 'وجه واحد', 0, 1),
    (product_id_1, 'الجانب', 'وجهين', 25, 2);

    -- Design service options
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_1, 'خدمة التصميم', 'لدي تصميم خاص', 0, 1),
    (product_id_1, 'خدمة التصميم', 'أحتاج خدمة تصميم', 50, 2);

    -- Production time options
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_1, 'مدة التنفيذ', '3 أيام', 30, 1),
    (product_id_1, 'مدة التنفيذ', '5 أيام', 15, 2),
    (product_id_1, 'مدة التنفيذ', '7 أيام', 0, 3);

    -- Sample options
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_1, 'عينة قبل الطباعة', 'نعم', 25, 1),
    (product_id_1, 'عينة قبل الطباعة', 'لا', 0, 2);
  END IF;

  -- Add options for second product
  IF product_id_2 IS NOT NULL THEN
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_2, 'الحجم', 'صغير', 0, 1),
    (product_id_2, 'الحجم', 'متوسط', 15, 2),
    (product_id_2, 'الحجم', 'كبير', 30, 3),
    (product_id_2, 'الكمية', '100 قطعة', 0, 1),
    (product_id_2, 'الكمية', '500 قطعة', 40, 2),
    (product_id_2, 'الكمية', '1000 قطعة', 70, 3),
    (product_id_2, 'المادة', 'عادي', 0, 1),
    (product_id_2, 'المادة', 'فاخر', 50, 2),
    (product_id_2, 'خدمة التصميم', 'لدي تصميم خاص', 0, 1),
    (product_id_2, 'خدمة التصميم', 'أحتاج خدمة تصميم', 60, 2),
    (product_id_2, 'مدة التنفيذ', '3 أيام', 25, 1),
    (product_id_2, 'مدة التنفيذ', '7 أيام', 0, 2),
    (product_id_2, 'عينة قبل الطباعة', 'نعم', 20, 1),
    (product_id_2, 'عينة قبل الطباعة', 'لا', 0, 2);
  END IF;

  -- Add options for third product
  IF product_id_3 IS NOT NULL THEN
    INSERT INTO product_options (product_id, option_type, option_name_ar, price_modifier, display_order) VALUES
    (product_id_3, 'الحجم', 'صغير', 0, 1),
    (product_id_3, 'الحجم', 'كبير', 20, 2),
    (product_id_3, 'الكمية', '100 قطعة', 0, 1),
    (product_id_3, 'الكمية', '500 قطعة', 30, 2),
    (product_id_3, 'المادة', 'عادي', 0, 1),
    (product_id_3, 'المادة', 'مميز', 35, 2),
    (product_id_3, 'خدمة التصميم', 'لدي تصميم خاص', 0, 1),
    (product_id_3, 'خدمة التصميم', 'أحتاج خدمة تصميم', 45, 2);
  END IF;
END $$;