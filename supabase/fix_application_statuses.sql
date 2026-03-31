-- =============================================================================
-- Migration: Relax application_status_check constraint
-- Run this in your Supabase SQL Editor.
-- =============================================================================

-- 1. Drop the old constraint
ALTER TABLE application DROP CONSTRAINT IF EXISTS application_status_check;

-- 2. Add the new relaxed constraint
ALTER TABLE application ADD CONSTRAINT application_status_check 
  CHECK (status IN ('pending', 'submitted', 'under_verification', 'approved', 'rejected'));

-- 3. Refresh schema cache
NOTIFY pgrst, 'reload schema';
