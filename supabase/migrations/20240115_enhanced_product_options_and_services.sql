/*
# Enhanced Product Options and Services System

## Overview
This migration adds comprehensive product options (quantity tiers, size, material, side options) 
and a complete services management system.

## New Tables

### 1. product_quantity_tiers
Stores quantity-based pricing tiers for products (e.g., 100 units = 1500 SAR, 500 units = 6000 SAR)
- `id` (uuid, primary key)
- `product_id` (uuid, references products)
- `quantity` (integer, the quantity amount)
- `price` (decimal, price for this quantity including 15% VAT)
- `created_at` (timestamptz)

### 2. product_size_options
Stores size options with price additions (e.g., A4 +0 SAR, A3 +50 SAR)
- `id` (uuid, primary key)
- `product_id` (uuid, references products)
- `name_ar` (text, size name in Arabic)
- `price_addition` (decimal, additional price for this size)
- `created_at` (timestamptz)

### 3. product_material_options
Stores material options with price additions (e.g., Standard Paper +0 SAR, Premium Paper +100 SAR)
- `id` (uuid, primary key)
- `product_id` (uuid, references products)
- `name_ar` (text, material name in Arabic)
- `price_addition` (decimal, additional price for this material)
- `created_at` (timestamptz)

### 4. product_side_options
Stores printing side options with price additions (e.g., One Side +0 SAR, Two Sides +50 SAR)
- `id` (uuid, primary key)
- `product_id` (uuid, references products)
- `name_ar` (text, side option name in Arabic)
- `price_addition` (decimal, additional price for this option)
- `created_at` (timestamptz)

### 5. services
Stores service offerings (design services, consultation, etc.)
- `id` (uuid, primary key)
- `name_ar` (text, service name in Arabic)
- `description_ar` (text, service description)
- `details` (text, detailed information)
- `image_url` (text, service image)
- `is_active` (boolean, whether service is available)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 6. service_inquiries
Stores customer inquiries about services
- `id` (uuid, primary key)
- `service_id` (uuid, references services)
- `customer_name` (text, customer's name)
- `email` (text, customer's email)
- `phone` (text, customer's phone)
- `message` (text, inquiry message)
- `status` (text, inquiry status: pending/contacted/resolved)
- `admin_notes` (text, internal notes)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security
- All tables are public (no RLS) for easy access
- Admin interface controls data management
*/

-- Create product_quantity_tiers table
CREATE TABLE IF NOT EXISTS product_quantity_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_product_quantity_tiers_product_id ON product_quantity_tiers(product_id);

-- Create product_size_options table
CREATE TABLE IF NOT EXISTS product_size_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name_ar text NOT NULL,
  price_addition decimal(10, 2) DEFAULT 0 CHECK (price_addition >= 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_product_size_options_product_id ON product_size_options(product_id);

-- Create product_material_options table
CREATE TABLE IF NOT EXISTS product_material_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name_ar text NOT NULL,
  price_addition decimal(10, 2) DEFAULT 0 CHECK (price_addition >= 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_product_material_options_product_id ON product_material_options(product_id);

-- Create product_side_options table
CREATE TABLE IF NOT EXISTS product_side_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name_ar text NOT NULL,
  price_addition decimal(10, 2) DEFAULT 0 CHECK (price_addition >= 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_product_side_options_product_id ON product_side_options(product_id);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  description_ar text NOT NULL,
  details text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_services_is_active ON services(is_active);

-- Create service_inquiries table
CREATE TABLE IF NOT EXISTS service_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_service_inquiries_service_id ON service_inquiries(service_id);
CREATE INDEX idx_service_inquiries_status ON service_inquiries(status);
CREATE INDEX idx_service_inquiries_created_at ON service_inquiries(created_at DESC);

-- Add trigger to update updated_at timestamp for services
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_services_updated_at();

-- Add trigger to update updated_at timestamp for service_inquiries
CREATE OR REPLACE FUNCTION update_service_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_inquiries_updated_at
  BEFORE UPDATE ON service_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_service_inquiries_updated_at();
