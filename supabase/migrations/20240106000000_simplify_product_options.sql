/*
# Simplify Product Options System

## Overview
This migration simplifies the product options system by removing the complex template/value/assignment structure
and replacing it with a direct product options table where admins can add options directly to products.

## Changes

### New Table: `simple_product_options`
- `id` (uuid, primary key): Unique identifier
- `product_id` (uuid, foreign key): References products table
- `option_name_ar` (text): Option name in Arabic (e.g., "الحجم", "المادة")
- `option_name_en` (text): Option name in English (e.g., "Size", "Material")
- `option_value_ar` (text): Option value in Arabic (e.g., "صغير", "كبير")
- `option_value_en` (text): Option value in English (e.g., "Small", "Large")
- `price_modifier` (decimal): Price adjustment for this option
- `is_available` (boolean): Whether this option is currently available
- `display_order` (integer): Order for displaying options
- `created_at` (timestamptz): Creation timestamp

### Quantity Pricing Integration
- Link quantity_pricing_tiers to simple_product_options via option_id
- Update foreign key reference

## Migration Strategy
1. Create new simple_product_options table
2. Keep old tables for now (can be removed later after data migration)
3. Update quantity_pricing_tiers to reference new table

## Example Data
Product: Business Cards
- Option: Size: Small (5x5cm) → +0 SAR
- Option: Size: Large (10x10cm) → +20 SAR
- Option: Material: Standard → +0 SAR
- Option: Material: Premium → +50 SAR

With quantity tiers for "Size: Large":
- 1-50 units: +20 SAR
- 51-100 units: +15 SAR
- 101+ units: +10 SAR
*/

-- Create simplified product options table
CREATE TABLE IF NOT EXISTS simple_product_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_name_ar text NOT NULL,
  option_name_en text,
  option_value_ar text NOT NULL,
  option_value_en text,
  price_modifier decimal(10, 2) NOT NULL DEFAULT 0,
  is_available boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_simple_options_product ON simple_product_options(product_id);
CREATE INDEX idx_simple_options_available ON simple_product_options(is_available);
CREATE INDEX idx_simple_options_order ON simple_product_options(display_order);

-- Add column to quantity_pricing_tiers to support both old and new systems
ALTER TABLE quantity_pricing_tiers 
ADD COLUMN IF NOT EXISTS simple_option_id uuid REFERENCES simple_product_options(id) ON DELETE CASCADE;

-- Create index for new foreign key
CREATE INDEX IF NOT EXISTS idx_quantity_tiers_simple_option ON quantity_pricing_tiers(simple_option_id);

-- Add comments
COMMENT ON TABLE simple_product_options IS 'Simplified product options - admins add options directly to products';
COMMENT ON COLUMN quantity_pricing_tiers.simple_option_id IS 'Reference to simplified product option (new system)';
COMMENT ON COLUMN quantity_pricing_tiers.option_value_id IS 'Reference to old template-based option value (legacy)';
