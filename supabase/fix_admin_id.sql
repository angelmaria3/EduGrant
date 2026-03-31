-- =============================================================================
-- Migration: Add admin_id to application table and refresh schema cache
-- Run this in your Supabase SQL Editor to resolve the schema cache error.
-- =============================================================================

ALTER TABLE application ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES admin(admin_id);

-- Notify PostgREST to reload the schema cache so it recognizes the newly added columns
NOTIFY pgrst, 'reload schema';
