-- =============================================================================
-- Migration: Add INSERT policy for admin table
-- Run this in your Supabase SQL Editor to allow admins to create staff accounts.
-- =============================================================================

-- Allow existing Admins to insert new records into the admin table
CREATE POLICY "Admins can insert new staff" 
ON admin
FOR INSERT 
WITH CHECK (
  auth.uid() IN (SELECT auth_user_id FROM admin WHERE role = 'admin')
);
