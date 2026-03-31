-- =============================================================================
-- Migration: 8-Semester Fee Structure & Student Semester Tracking
-- Run this in your Supabase SQL Editor.
-- =============================================================================

-- 1. Add current_semester to student table
ALTER TABLE student ADD COLUMN IF NOT EXISTS current_semester INTEGER DEFAULT 1 CHECK (current_semester BETWEEN 1 AND 8);

-- 2. Create global_fee_structure table
CREATE TABLE IF NOT EXISTS global_fee_structure (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  semester        INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
  academic_year   INTEGER NOT NULL,
  tuition_fee     NUMERIC(10,2) NOT NULL DEFAULT 0,
  exam_fee        NUMERIC(10,2) NOT NULL DEFAULT 0,
  university_fee  NUMERIC(10,2) NOT NULL DEFAULT 0,
  bus_fee         NUMERIC(10,2) NOT NULL DEFAULT 0,
  arts_sports_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  misc_fee        NUMERIC(10,2) NOT NULL DEFAULT 0,
  UNIQUE(semester, academic_year)
);

-- 3. Insert default values for all 8 semesters (Academic Year 2026)
DO $$
DECLARE
    yr INT := 2026;
BEGIN
    FOR sem IN 1..8 LOOP
        INSERT INTO global_fee_structure (semester, academic_year, tuition_fee, exam_fee, university_fee, bus_fee, arts_sports_fee, misc_fee)
        VALUES (sem, yr, 3500, 2500, 2000, 1300, 750, 950)
        ON CONFLICT (semester, academic_year) DO UPDATE SET
            tuition_fee = EXCLUDED.tuition_fee,
            exam_fee = EXCLUDED.exam_fee,
            university_fee = EXCLUDED.university_fee,
            bus_fee = EXCLUDED.bus_fee,
            arts_sports_fee = EXCLUDED.arts_sports_fee,
            misc_fee = EXCLUDED.misc_fee;
    END LOOP;
END $$;

-- 4. Enable RLS
ALTER TABLE global_fee_structure ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Public Read for Fee Structure" ON global_fee_structure FOR SELECT USING (true);
CREATE POLICY "Admin All for Fee Structure" ON global_fee_structure FOR ALL USING (
  EXISTS (SELECT 1 FROM admin WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- 6. Refresh schema cache
NOTIFY pgrst, 'reload schema';
