/*
# Update Authentication System with Social Auth and Enhanced Profile

## Changes Made

1. **Updated handle_new_user Function**
   - Now extracts email, phone, and full_name from user metadata
   - Supports both username-based and email-based registration
   - Handles social auth providers (Google, Facebook)

2. **Security**
   - Maintains existing RLS policies
   - First user becomes admin
   - Users can view and edit their own profiles

## Notes
- Compatible with Google and Facebook OAuth
- Supports traditional username + password
- Extracts metadata from auth.users.raw_user_meta_data
*/

-- Update handle_new_user function to support enhanced registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
  extracted_email text;
  extracted_phone text;
  extracted_full_name text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username (from email or metadata)
  IF NEW.email LIKE '%@miaoda.com' THEN
    extracted_username := SPLIT_PART(NEW.email, '@', 1);
    extracted_email := NULL;
  ELSE
    extracted_username := COALESCE(
      NEW.raw_user_meta_data->>'username',
      SPLIT_PART(NEW.email, '@', 1)
    );
    extracted_email := NEW.email;
  END IF;
  
  -- Extract phone from metadata or phone field
  extracted_phone := COALESCE(
    NEW.raw_user_meta_data->>'phone',
    NEW.phone
  );
  
  -- Extract full name from metadata
  extracted_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name'
  );
  
  INSERT INTO profiles (id, username, email, phone, full_name, role)
  VALUES (
    NEW.id,
    extracted_username,
    extracted_email,
    extracted_phone,
    extracted_full_name,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;
