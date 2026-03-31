-- =============================================================================
-- Migration: Add remarks to document table for verification queue
-- Run this in your Supabase SQL Editor to update your existing database.
-- =============================================================================

ALTER TABLE document ADD COLUMN IF NOT EXISTS remarks TEXT;
