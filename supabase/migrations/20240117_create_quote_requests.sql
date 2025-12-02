/*
# Create Quote Requests Table (طلبات التسعير)

## Plain English Explanation
This migration creates a table to store pricing quote requests from customers.
Customers can request quotes for custom printing projects by providing details
about their requirements. Admins can view and manage these requests.

## Table: quote_requests

### Columns:
- `id` (uuid, primary key): Unique identifier for each quote request
- `name` (text, required): Customer name
- `email` (text, required): Customer email address
- `phone` (text): Customer phone number (optional)
- `company` (text): Company name (optional)
- `project_type` (text): Type of printing project
- `quantity` (integer): Estimated quantity needed
- `description` (text, required): Detailed description of requirements
- `budget_range` (text): Customer's budget range (optional)
- `deadline` (date): Desired completion date (optional)
- `status` (text, default: 'pending'): Request status (pending, reviewed, quoted, completed)
- `admin_notes` (text): Internal notes from admin (optional)
- `created_at` (timestamptz): When the request was created
- `updated_at` (timestamptz): When the request was last updated

## Security
- No RLS enabled (public can submit, admin can view all)
- Public users can create quote requests
- Admin has full access to manage requests

## Indexes
- Index on `status` for filtering requests by status
- Index on `created_at` for sorting by date
*/

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  project_type text,
  quantity integer,
  description text NOT NULL,
  budget_range text,
  deadline date,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'reviewed', 'quoted', 'completed', 'cancelled')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_quote_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_quote_requests_updated_at();
