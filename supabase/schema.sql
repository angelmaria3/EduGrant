-- =============================================================================
-- EDUGRANT (SFCES) — Advanced Scholarship Engine Schema (13+ Schemes)
-- Run this ENTIRE file in Supabase Dashboard → SQL Editor → New Query
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABLES

CREATE TABLE IF NOT EXISTS student (
  student_id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  register_number       VARCHAR(20)   UNIQUE NOT NULL,
  name                  VARCHAR(100)  NOT NULL,
  dob                   DATE          NOT NULL,
  gender                VARCHAR(10)   NOT NULL,
  email                 VARCHAR(150)  UNIQUE NOT NULL,
  phone                 VARCHAR(15),
  department            VARCHAR(80)   NOT NULL,
  year_study            INTEGER       CHECK (year_study BETWEEN 1 AND 4),
  category              VARCHAR(30)   NOT NULL,
  annual_income         NUMERIC(12,2) NOT NULL DEFAULT 0,
  cgpa                  NUMERIC(4,2)  CHECK (cgpa BETWEEN 0 AND 10),
  
  -- Advanced Demographics
  course_level          VARCHAR(20)   CHECK (course_level IN ('UG', 'PG', 'Diploma')),
  course_type           VARCHAR(50)   CHECK (course_type IN ('Technical', 'Science', 'Arts', 'Commerce', 'Other')),
  marks_12              NUMERIC(5,2)  CHECK (marks_12 BETWEEN 0 AND 100),
  disability_percentage INTEGER       DEFAULT 0 CHECK (disability_percentage BETWEEN 0 AND 100),
  religion              VARCHAR(50),
  state_of_domicile     VARCHAR(50),
  
  -- Admission Details
  admission_type        VARCHAR(20)   CHECK (admission_type IN ('Merit', 'Management', 'NRI')),
  tfw_seat              BOOLEAN       DEFAULT false,
  sports_quota          VARCHAR(20)   CHECK (sports_quota IN ('None', 'State', 'National', 'International')),
  siblings_in_college   INTEGER       DEFAULT 0,
  financial_crisis      BOOLEAN       DEFAULT false,

  auth_user_id    UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin (
  admin_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  UNIQUE NOT NULL,
  phone        VARCHAR(15),
  role         VARCHAR(30)   NOT NULL CHECK (role IN ('admin','office_staff')),
  auth_user_id UUID          UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ   DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scholarship (
  scholarship_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scholarship_name VARCHAR(150)  NOT NULL,
  description      TEXT,
  amount           NUMERIC(10,2) NOT NULL,
  is_percentage    BOOLEAN       DEFAULT false, -- If true, amount is a percentage of total_fee (0.00 to 100.00)
  provider         VARCHAR(100)  NOT NULL,
  type             VARCHAR(30)   NOT NULL
                   CHECK (type IN ('merit','need','category_based','fee_concession','disability_based','gender_based','religion_based')),
  applicable_year  INTEGER       NOT NULL,
  created_at       TIMESTAMPTZ   DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eligibility_criteria (
  criteria_id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scholarship_id        UUID REFERENCES scholarship(scholarship_id) ON DELETE CASCADE,
  
  -- Existing
  min_cgpa              NUMERIC(4,2)  NOT NULL DEFAULT 0,
  max_income            NUMERIC(12,2) NOT NULL DEFAULT 99999999,
  eligible_category     VARCHAR(100), -- Format: "SC,ST,OBC" (comma separated)
  year_of_study         INTEGER,
  
  -- Advanced Additions
  min_marks_12          NUMERIC(5,2)  DEFAULT 0,
  req_course_level      VARCHAR(100), -- Format: "UG,PG" 
  req_course_type       VARCHAR(100), -- Format: "Technical"
  req_gender            VARCHAR(20),  -- e.g., 'Female'
  min_disability        INTEGER       DEFAULT 0,
  req_religion          VARCHAR(255), -- "Muslim,Christian,Sikh,Buddhist,Jain,Parsi"
  req_state             VARCHAR(50),
  req_admission_type    VARCHAR(100), -- "Merit"
  req_tfw               BOOLEAN       DEFAULT false,
  req_sports            VARCHAR(100), -- "State,National"
  min_siblings          INTEGER       DEFAULT 0,
  req_crisis            BOOLEAN       DEFAULT false,
  
  other_conditions   TEXT
);

CREATE TABLE IF NOT EXISTS application (
  application_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id       UUID REFERENCES student(student_id) ON DELETE CASCADE,
  scholarship_id   UUID REFERENCES scholarship(scholarship_id),
  admin_id         UUID REFERENCES admin(admin_id),
  application_date TIMESTAMPTZ DEFAULT now(),
  year             INTEGER NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected')),
  remarks          TEXT,
  UNIQUE (student_id, scholarship_id, year)
);

CREATE TABLE IF NOT EXISTS document (
  document_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id      UUID REFERENCES application(application_id) ON DELETE CASCADE,
  document_type       VARCHAR(80) NOT NULL,
  document_path       TEXT NOT NULL,
  verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
                      CHECK (verification_status IN ('pending','verified','rejected')),
  uploaded_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fee_details (
  fee_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID REFERENCES student(student_id) ON DELETE CASCADE,
  total_fee      NUMERIC(10,2) NOT NULL,
  paid_amount    NUMERIC(10,2) NOT NULL DEFAULT 0,
  pending_amount NUMERIC(10,2) GENERATED ALWAYS AS (total_fee - paid_amount) STORED,
  payment_status VARCHAR(20)   NOT NULL DEFAULT 'unpaid'
                 CHECK (payment_status IN ('paid','partial','unpaid')),
  academic_year  INTEGER NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, academic_year)
);

-- RLS
ALTER TABLE student ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE application ENABLE ROW LEVEL SECURITY;
ALTER TABLE document ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_details ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION get_user_role() RETURNS TEXT AS $$
  SELECT role FROM admin WHERE auth_user_id = auth.uid()
  UNION ALL SELECT 'student' FROM student WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_student_id() RETURNS UUID AS $$
  SELECT student_id FROM student WHERE auth_user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Simple Policies 
CREATE POLICY "student_select_own" ON student FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "admin_select_students" ON student FOR SELECT USING (get_user_role() IN ('admin', 'office_staff'));
CREATE POLICY "student_insert_own" ON student FOR INSERT WITH CHECK (auth_user_id = auth.uid());
CREATE POLICY "student_update_own" ON student FOR UPDATE USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());
CREATE POLICY "admin_update_students" ON student FOR UPDATE USING (get_user_role() IN ('admin', 'office_staff'));

CREATE POLICY "admin_select_own" ON admin FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "admin_select_all" ON admin FOR SELECT USING (get_user_role() = 'admin');

CREATE POLICY "public_read" ON scholarship FOR SELECT USING (true);
CREATE POLICY "admin_all" ON scholarship FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "public_read_crit" ON eligibility_criteria FOR SELECT USING (true);
CREATE POLICY "admin_all_crit" ON eligibility_criteria FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "app_select" ON application FOR SELECT USING (student_id = get_student_id() OR get_user_role() IN ('admin', 'office_staff'));
CREATE POLICY "app_insert" ON application FOR INSERT WITH CHECK (student_id = get_student_id());
CREATE POLICY "app_update" ON application FOR UPDATE USING (get_user_role() IN ('admin', 'office_staff'));

CREATE POLICY "doc_select" ON document FOR SELECT USING (
  get_user_role() IN ('admin', 'office_staff') OR application_id IN (SELECT application_id FROM application WHERE student_id = get_student_id())
);
CREATE POLICY "doc_insert" ON document FOR INSERT WITH CHECK (application_id IN (SELECT application_id FROM application WHERE student_id = get_student_id()));
CREATE POLICY "doc_update" ON document FOR UPDATE USING (get_user_role() IN ('admin', 'office_staff'));

CREATE POLICY "fee_select" ON fee_details FOR SELECT USING (student_id = get_student_id() OR get_user_role() IN ('admin', 'office_staff'));
CREATE POLICY "fee_all" ON fee_details FOR ALL USING (get_user_role() IN ('admin', 'office_staff'));

-- Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('sfces-documents', 'sfces-documents', false) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "storage_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sfces-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'sfces-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR get_user_role() IN ('admin', 'office_staff')));

-- 2. ELIGIBILITY FUNCTION
CREATE OR REPLACE FUNCTION get_eligible_scholarships(p_student_id UUID)
RETURNS TABLE(scholarship_id UUID, scholarship_name TEXT, amount NUMERIC, is_percentage BOOLEAN, reason TEXT) AS $$
DECLARE
  s RECORD;
BEGIN
  SELECT * INTO s FROM student WHERE student_id = p_student_id;

  RETURN QUERY
  SELECT
    sch.scholarship_id, sch.scholarship_name::TEXT, sch.amount, sch.is_percentage, 'Eligible'::TEXT
  FROM scholarship sch
  JOIN eligibility_criteria ec ON ec.scholarship_id = sch.scholarship_id
  WHERE
    sch.applicable_year = EXTRACT(YEAR FROM NOW())::INT AND
    s.cgpa >= ec.min_cgpa AND
    s.annual_income <= ec.max_income AND
    (ec.min_marks_12 = 0 OR s.marks_12 >= ec.min_marks_12) AND
    (ec.min_disability = 0 OR s.disability_percentage >= ec.min_disability) AND
    (ec.min_siblings = 0 OR s.siblings_in_college >= ec.min_siblings) AND
    (ec.req_tfw = false OR s.tfw_seat = true) AND
    (ec.req_crisis = false OR s.financial_crisis = true) AND
    (ec.year_of_study IS NULL OR s.year_study = ec.year_of_study) AND
    (ec.req_gender IS NULL OR s.gender ILIKE ec.req_gender) AND
    (ec.req_state IS NULL OR s.state_of_domicile ILIKE '%' || ec.req_state || '%') AND
    (ec.eligible_category IS NULL OR ec.eligible_category ILIKE '%' || s.category || '%') AND
    (ec.req_course_level IS NULL OR ec.req_course_level ILIKE '%' || s.course_level || '%') AND
    (ec.req_course_type IS NULL OR ec.req_course_type ILIKE '%' || s.course_type || '%') AND
    (ec.req_religion IS NULL OR ec.req_religion ILIKE '%' || s.religion || '%') AND
    (ec.req_admission_type IS NULL OR ec.req_admission_type ILIKE '%' || s.admission_type || '%') AND
    (ec.req_sports IS NULL OR ec.req_sports ILIKE '%' || s.sports_quota || '%') AND
    NOT EXISTS (
      SELECT 1 FROM application a
      WHERE a.student_id = p_student_id AND a.scholarship_id = sch.scholarship_id AND a.year = EXTRACT(YEAR FROM NOW())::INT
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;


-- 3. SEEDING THE 13 ADVANCED SCHEMES

DO $$ 
DECLARE
  v_Central UUID := uuid_generate_v4();
  v_Pragati UUID := uuid_generate_v4();
  v_Saksham UUID := uuid_generate_v4();
  v_PostMat UUID := uuid_generate_v4();
  v_MinMC   UUID := uuid_generate_v4();
  v_Inspire UUID := uuid_generate_v4();
  v_Kerala  UUID := uuid_generate_v4();
  
  v_TFW     UUID := uuid_generate_v4();
  v_Egrantz UUID := uuid_generate_v4();
  v_KtU_PM  UUID := uuid_generate_v4();
  v_EWS     UUID := uuid_generate_v4();
  v_MinCon  UUID := uuid_generate_v4();
  v_ColMerit UUID := uuid_generate_v4();
  v_ColSport UUID := uuid_generate_v4();
  
  yr INT := EXTRACT(YEAR FROM NOW())::INT;
BEGIN

-- SCHOLARSHIPS (Fixed Amount)
INSERT INTO scholarship (scholarship_id, scholarship_name, description, amount, is_percentage, provider, type, applicable_year) VALUES
  (v_Central, '1. Central Sector Scholarship', 'Merit+Income: 12th >80%, Income <8L, UG/PG', 10000, false, 'Central Govt', 'merit', yr),
  (v_Pragati, '2. AICTE Pragati Scholarship', 'Girls in technical degree, Income <8L', 50000, false, 'AICTE', 'gender_based', yr),
  (v_Saksham, '3. AICTE Saksham Scholarship', 'Disability >=40%, Technical course, Income <8L', 50000, false, 'AICTE', 'disability_based', yr),
  (v_PostMat, '4. Post Matric (SC/ST/OBC)', 'SC/ST/OBC, Income <2.5L, UG/PG', 25000, false, 'Govt', 'category_based', yr),
  (v_MinMC,   '5. Merit-cum-Means (Minority)', 'Minority religions, Marks >=50%, Income <2L', 30000, false, 'Govt', 'religion_based', yr),
  (v_Inspire, '6. INSPIRE Scholarship', 'Science stream, 12th Marks >95%, UG Science', 80000, false, 'DST', 'merit', yr),
  (v_Kerala,  '7. Kerala Higher Education', 'Kerala domicile, Income <2L', 15000, false, 'Kerala Govt', 'need', yr);

INSERT INTO eligibility_criteria (scholarship_id, min_cgpa, max_income, min_marks_12, req_course_level, req_gender, req_course_type, min_disability, eligible_category, req_religion, req_state) VALUES
  (v_Central, 8.00, 800000, 80.00, 'UG,PG', NULL, NULL, 0, NULL, NULL, NULL),
  (v_Pragati, 0.00, 800000, 0, NULL, 'Female', 'Technical', 0, NULL, NULL, NULL),
  (v_Saksham, 0.00, 800000, 0, NULL, NULL, 'Technical', 40, NULL, NULL, NULL),
  (v_PostMat, 0.00, 250000, 0, 'UG,PG', NULL, NULL, 0, 'SC,ST,OBC', NULL, NULL),
  (v_MinMC,   5.00, 200000, 50.00, NULL, NULL, NULL, 0, NULL, 'Muslim,Christian,Sikh,Buddhist,Jain,Parsi', NULL),
  (v_Inspire, 0.00, 99999999, 95.00, NULL, NULL, 'Science', 0, NULL, NULL, NULL),
  (v_Kerala,  0.00, 200000, 0, 'UG,PG', NULL, NULL, 0, NULL, NULL, 'Kerala');


-- FEE CONCESSIONS (Percentage Based Amount)
INSERT INTO scholarship (scholarship_id, scholarship_name, description, amount, is_percentage, provider, type, applicable_year) VALUES
  (v_TFW,     'C1. Tuition Fee Waiver (TFW)', '100% Waiver for merit admission with TFW seat, Income <8L', 100, true, 'AICTE', 'fee_concession', yr),
  (v_Egrantz, 'C2. E-Grantz Scheme', '100% Waiver for SC/ST/OEC, Income <6L', 100, true, 'Kerala Govt', 'fee_concession', yr),
  (v_KtU_PM,  'C3. State Post Matric', 'Tuition reimbursement for SC/ST/OBC, Income <2.5L', 80, true, 'Govt', 'fee_concession', yr),
  (v_EWS,     'C4. EWS Concession', 'Partial reduction for General EWS, Income <8L', 25, true, 'Govt', 'fee_concession', yr),
  (v_MinCon,  'C5. Minority Fee Concession', 'Professional courses, Minority, Income <2L', 50, true, 'Govt', 'fee_concession', yr),
  (v_ColMerit,'C6. College Merit Concession', '75% reduction for 12th Marks >90%', 75, true, 'Institution', 'merit', yr),
  (v_ColSport,'C7. Sports Quota Waiver', '50% reduction for State/National players', 50, true, 'Institution', 'merit', yr);

INSERT INTO eligibility_criteria (scholarship_id, min_cgpa, max_income, req_admission_type, req_tfw, eligible_category, req_religion, min_marks_12, req_sports) VALUES
  (v_TFW,     0.00, 800000, 'Merit', true, NULL, NULL, 0, NULL),
  (v_Egrantz, 0.00, 600000, NULL, false, 'SC,ST,OEC', NULL, 0, NULL),
  (v_KtU_PM,  0.00, 250000, NULL, false, 'SC,ST,OBC', NULL, 0, NULL),
  (v_EWS,     0.00, 800000, NULL, false, 'EWS,General', NULL, 0, NULL),
  (v_MinCon,  0.00, 200000, NULL, false, NULL, 'Muslim,Christian,Sikh,Buddhist,Jain,Parsi', 0, NULL),
  (v_ColMerit,9.00, 99999999, NULL, false, NULL, NULL, 90.00, NULL),
  (v_ColSport,0.00, 99999999, NULL, false, NULL, NULL, 0, 'State,National,International');

END $$;
