
# Add Sample Seasonal Offers

This migration adds sample seasonal offers to make the seasonal offers section visible on the home page.

## Changes
1. Insert 3 sample seasonal offers with:
   - Arabic titles and descriptions
   - Discount percentages
   - Valid date ranges (current month)
   - Active status
   - Sample images

## Sample Offers
1. Winter Printing Discount - 25% off
2. Business Cards Special - 30% off
3. Packaging Bundle Deal - 20% off

## Notes
- All offers are set to active
- Date ranges are set for December 2025
- Images use placeholder URLs
- Can be deleted or modified by admin
*/

-- Insert sample seasonal offers
INSERT INTO seasonal_offers (
  title_ar,
  description_ar,
  discount_percentage,
  start_date,
  end_date,
  image_url,
  is_active
) VALUES
(
  'عرض الشتاء الخاص',
  'احصل على خصم 25% على جميع خدمات الطباعة. عرض محدود لفترة الشتاء فقط!',
  25,
  '2025-12-01',
  '2025-12-31',
  'https://images.unsplash.com/photo-1607827448387-a67db1383b59?w=800&h=600&fit=crop',
  true
),
(
  'عرض بطاقات الأعمال',
  'خصم 30% على طباعة بطاقات الأعمال. اطلب الآن واحصل على تصميم مجاني!',
  30,
  '2025-12-01',
  '2025-12-31',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
  true
),
(
  'عرض التغليف الشامل',
  'وفر 20% على جميع منتجات التغليف والصناديق. مثالي للشركات والمتاجر!',
  20,
  '2025-12-01',
  '2025-12-31',
  'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&h=600&fit=crop',
  true
);
