/*
# Add Quantity-Based Pricing Tiers

This migration adds support for quantity-based pricing tiers for product option values.
Admins can now set different prices based on quantity ranges.

## New Tables

### `quantity_pricing_tiers`
- `id` (uuid, primary key): Unique identifier
- `option_value_id` (uuid, foreign key): References product_option_values
- `min_quantity` (integer): Minimum quantity for this tier
- `max_quantity` (integer, nullable): Maximum quantity for this tier (null = unlimited)
- `price_modifier` (decimal): Additional price for this tier
- `created_at` (timestamptz): Creation timestamp

## Example Usage

For a "Size: Large" option value:
- Tier 1: 1-50 units → +20 SAR
- Tier 2: 51-100 units → +15 SAR (bulk discount)
- Tier 3: 101+ units → +10 SAR (larger bulk discount)

## Security

- No RLS needed (public data)
- Admins manage through admin panel
*/

-- Create quantity pricing tiers table
CREATE TABLE IF NOT EXISTS quantity_pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  option_value_id uuid NOT NULL REFERENCES product_option_values(id) ON DELETE CASCADE,
  min_quantity integer NOT NULL CHECK (min_quantity > 0),
  max_quantity integer CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  price_modifier decimal(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_tier_range UNIQUE (option_value_id, min_quantity)
);

-- Create index for faster queries
CREATE INDEX idx_quantity_tiers_option_value ON quantity_pricing_tiers(option_value_id);
CREATE INDEX idx_quantity_tiers_range ON quantity_pricing_tiers(min_quantity, max_quantity);

-- Add comment
COMMENT ON TABLE quantity_pricing_tiers IS 'Quantity-based pricing tiers for product option values';
