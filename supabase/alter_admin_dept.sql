-- =============================================================================
-- Migration: Add department column to admin table
-- Run this in your Supabase SQL Editor.
-- =============================================================================

ALTER TABLE admin ADD COLUMN IF NOT EXISTS department VARCHAR(100);

-- Refresh the schema cache in Supabase after running this by clicking the little 
-- reload icon or simply reloading the page for it to take effect!
