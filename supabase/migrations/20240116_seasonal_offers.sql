/*
# Create Seasonal Offers Table (عروض موسمية)

## Plain English Explanation
This migration creates a table to store seasonal offers/promotions that can be displayed
on the website with animations. Admins can create, edit, and manage these offers with
start and end dates, discount percentages, and images.

## Table: seasonal_offers

### Columns:
- `id` (uuid, primary key): Unique identifier for each offer
- `title_ar` (text, required): Offer title in Arabic
- `description_ar` (text, required): Offer description in Arabic
- `discount_percentage` (integer): Discount percentage (0-100)
- `start_date` (timestamptz, required): When the offer starts
- `end_date` (timestamptz, required): When the offer ends
- `image_url` (text): URL to offer image
- `is_active` (boolean, default: true): Whether the offer is currently active
- `created_at` (timestamptz): When the offer was created
- `updated_at` (timestamptz): When the offer was last updated

## Security
- No RLS enabled (admin-only access assumed)
- Public can read active offers through API

## Indexes
- Index on `is_active` for filtering active offers
- Index on `start_date` and `end_date` for date range queries
*/

-- Create seasonal_offers table
CREATE TABLE IF NOT EXISTS seasonal_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  description_ar text NOT NULL,
  discount_percentage integer CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  image_url text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_seasonal_offers_active ON seasonal_offers(is_active);
CREATE INDEX IF NOT EXISTS idx_seasonal_offers_dates ON seasonal_offers(start_date, end_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_seasonal_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER seasonal_offers_updated_at
  BEFORE UPDATE ON seasonal_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_seasonal_offers_updated_at();

-- Add constraint to ensure end_date is after start_date
ALTER TABLE seasonal_offers
  ADD CONSTRAINT check_date_range CHECK (end_date > start_date);
