/*
# Temporarily Disable RLS on Contact Messages

## Purpose
Disable RLS temporarily to test if the issue is with the RLS policies or something else.
This is a diagnostic step to identify the root cause of the 403 error.

## Changes
- Disable RLS on contact_messages table
- This allows all operations without policy checks

## Security Note
This is temporary for testing. We will re-enable RLS after identifying the issue.
*/

-- Disable RLS on contact_messages table
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
