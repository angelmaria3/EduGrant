-- =============================================================================
-- Migration: Add support for external scholarship applications
-- Run this in your Supabase SQL Editor to update your existing database.
-- =============================================================================

-- 1. Add columns to the existing tables
ALTER TABLE scholarship ADD COLUMN IF NOT EXISTS external_url TEXT;

ALTER TABLE application ADD COLUMN IF NOT EXISTS external_application_id VARCHAR(255);
ALTER TABLE application ADD COLUMN IF NOT EXISTS external_portal_name VARCHAR(150);

-- 2. Update existing scholarships with their respective URLs
-- Note: This matches the names as created in the original seeds.
UPDATE scholarship SET external_url = 'https://scholarships.gov.in/' 
WHERE scholarship_name ILIKE '%Central Sector Scholarship%';

UPDATE scholarship SET external_url = 'https://scholarships.gov.in/' 
WHERE scholarship_name ILIKE '%AICTE Pragati Scholarship%';

UPDATE scholarship SET external_url = 'https://www.aicte.gov.in/schemes/students-development-schemes/Pragati/General-Instructions' 
WHERE scholarship_name ILIKE '%AICTE Saksham Scholarship%';

UPDATE scholarship SET external_url = 'https://scholarships.gov.in/' 
WHERE scholarship_name ILIKE '%Post Matric (SC/ST/OBC)%';

UPDATE scholarship SET external_url = 'https://scholarships.gov.in/' 
WHERE scholarship_name ILIKE '%Merit-cum-Means (Minority)%';

UPDATE scholarship SET external_url = 'https://online-inspire.gov.in/' 
WHERE scholarship_name ILIKE '%INSPIRE Scholarship%';

UPDATE scholarship SET external_url = 'https://scholarship.kshec.kerala.gov.in/' 
WHERE scholarship_name ILIKE '%Kerala Higher Education%';

UPDATE scholarship SET external_url = 'https://egrantz.kerala.gov.in/' 
WHERE scholarship_name ILIKE '%E-Grantz Scheme%';

UPDATE scholarship SET external_url = 'https://egrantz.kerala.gov.in/' 
WHERE scholarship_name ILIKE '%State Post Matric%';
