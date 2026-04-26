-- iCARE++ Database Schema Update for Admin Features
-- This migration adds new tables for Room Management, Permissions, Access Levels, and System Config
-- Run this in your Supabase SQL Editor after the initial schema.sql

-- ============================================================
-- UPDATE EXISTING PROFILES TABLE - Add new roles and status
-- ============================================================

-- Add status column if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Add new roles to the check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'faculty', 'administrator', 'super_admin'));

-- ============================================================
-- NEW TABLE: Rooms (Clinical Simulation Rooms)
-- ============================================================

CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 10,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    floor INTEGER NOT NULL DEFAULT 1,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for rooms
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage rooms" ON rooms FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrator', 'super_admin')));

-- Insert sample rooms data
INSERT INTO rooms (name, capacity, status, floor) VALUES
    ('Room 1', 10, 'active', 1),
    ('Room 2', 10, 'active', 1),
    ('Room 3', 8, 'active', 2),
    ('Room 4', 8, 'inactive', 2),
    ('Room 5', 12, 'active', 2),
    ('Room 6', 10, 'active', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- NEW TABLE: Room Assignments (Student-Room Mapping)
-- ============================================================

CREATE TABLE IF NOT EXISTS room_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, student_id)
);

-- RLS for room_assignments
ALTER TABLE room_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage assignments" ON room_assignments FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'administrator', 'super_admin')));

-- ============================================================
-- NEW TABLE: Permissions (RBAC Permissions Matrix)
-- ============================================================

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    student BOOLEAN DEFAULT false,
    faculty BOOLEAN DEFAULT false,
    administrator BOOLEAN DEFAULT false,
    super_admin BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for permissions
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can manage permissions" ON permissions FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Insert default permissions
INSERT INTO permissions (name, description, student, faculty, administrator, super_admin) VALUES
    ('View Patient Records', 'Access patient data and vital signs', true, true, true, true),
    ('Edit Patient Records', 'Modify patient information', false, true, true, true),
    ('View Analytics Dashboard', 'Access performance analytics', false, true, true, true),
    ('Generate Reports', 'Create competency and performance reports', false, true, true, true),
    ('Manage Rooms', 'Add, edit, or delete clinical rooms', false, false, true, true),
    ('Manage Faculty', 'Add, edit, or delete faculty accounts', false, false, true, true),
    ('Manage Students', 'Add, edit, or delete student accounts', false, true, true, true),
    ('Manage Question Bank', 'Create and manage quiz questions', false, true, true, true),
    ('Assign Students to Rooms', 'Assign students to clinical rooms', false, false, true, true),
    ('View Audit Trail', 'Access system activity logs', false, false, true, true),
    ('Configure RBAC', 'Manage role-based access control settings', false, false, false, true),
    ('System Settings', 'Modify system configurations', false, false, false, true),
    ('Take Adaptive Quiz', 'Answer assessment questions', true, false, false, false),
    ('Monitor Patient Vitals', 'View real-time patient vital signs', true, false, false, false),
    ('Receive Alerts', 'Get at-risk student notifications', false, true, true, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- NEW TABLE: Access Levels
-- ============================================================

CREATE TABLE IF NOT EXISTS access_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for access_levels
ALTER TABLE access_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can manage access levels" ON access_levels FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Insert default access levels
INSERT INTO access_levels (name, level, description) VALUES
    ('Read Only', 1, 'View data only, no modifications'),
    ('Standard User', 2, 'View and edit own data'),
    ('Supervisor', 3, 'Manage students and view analytics'),
    ('Administrator', 4, 'Full management of users and rooms'),
    ('Super Administrator', 5, 'Full system access including RBAC')
ON CONFLICT DO NOTHING;

-- ============================================================
-- NEW TABLE: System Configuration
-- ============================================================

CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id)
);

-- RLS for system_config
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can manage system config" ON system_config FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Insert default system configuration
INSERT INTO system_config (key, value, description) VALUES
    ('institution_name', 'Batangas State University - TNEU ARASOF Nasugbu', 'Name of the institution'),
    ('academic_year', '2024-2025', 'Current academic year'),
    ('semester', 'First Semester', 'Current semester'),
    ('data_privacy_enabled', 'true', 'Enable Philippine Data Privacy Act compliance'),
    ('email_notifications', 'true', 'Enable email notifications for alerts')
ON CONFLICT DO NOTHING;

-- ============================================================
-- NEW TABLE: Faculty Details (Extended Profile for Faculty)
-- ============================================================

CREATE TABLE IF NOT EXISTS faculty_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    department VARCHAR(100) DEFAULT 'Nursing',
    specialization VARCHAR(100),
    years_experience INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for faculty_details
ALTER TABLE faculty_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view own details" ON faculty_details FOR SELECT 
USING (faculty_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrator', 'super_admin')));

CREATE POLICY "Admin can manage faculty details" ON faculty_details FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('administrator', 'super_admin')));

-- Insert sample faculty details
INSERT INTO faculty_details (faculty_id, department, specialization, years_experience, status)
SELECT p.id, 'Nursing', 'Medical-Surgical Nursing', 12, 'active'
FROM profiles p WHERE p.full_name = 'Dr. Maria Santos'
ON CONFLICT DO NOTHING;

-- ============================================================
-- UPDATE PERFORMANCE LOGS - Add at_risk flag
-- ============================================================

ALTER TABLE performance_logs ADD COLUMN IF NOT EXISTS at_risk BOOLEAN DEFAULT false;
ALTER TABLE performance_logs ADD COLUMN IF NOT EXISTS risk_score INTEGER;
ALTER TABLE performance_logs ADD COLUMN IF NOT EXISTS competency_area VARCHAR(100);

-- ============================================================
-- ADD INDEXES FOR NEW TABLES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor);
CREATE INDEX IF NOT EXISTS idx_room_assignments_room_id ON room_assignments(room_id);
CREATE INDEX IF NOT EXISTS idx_room_assignments_student_id ON room_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_faculty_details_faculty_id ON faculty_details(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_details_status ON faculty_details(status);

-- ============================================================
-- CREATE VIEW: Admin Dashboard Summary
-- ============================================================

CREATE OR REPLACE VIEW admin_dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM profiles WHERE role = 'student') as total_students,
    (SELECT COUNT(*) FROM profiles WHERE role = 'student' AND id IN (
        SELECT user_id FROM performance_logs 
        GROUP BY user_id 
        HAVING AVG(score) < 60
    )) as at_risk_students,
    (SELECT COUNT(*) FROM rooms WHERE status = 'active') as active_rooms,
    (SELECT COUNT(*) FROM profiles p 
     JOIN faculty_details fd ON p.id = fd.faculty_id 
     WHERE fd.status = 'active') as active_faculty,
    (SELECT COUNT(*) FROM profiles WHERE COALESCE(status, 'active') = 'active') as active_users,
    (SELECT AVG(score) FROM performance_logs) as average_score;

-- ============================================================
-- CREATE VIEW: Student with Risk Status
-- ============================================================

CREATE OR REPLACE VIEW students_with_risk AS
SELECT 
    p.id as student_id,
    p.full_name as student_name,
    p.email,
    COALESCE(AVG(pl.score), 0) as average_score,
    COUNT(pl.id) as total_quizzes,
    CASE 
        WHEN COALESCE(AVG(pl.score), 0) < 60 THEN true
        ELSE false
    END as at_risk,
    MAX(pl.created_at) as last_activity,
    ra.room_id,
    r.name as room_name
FROM profiles p
LEFT JOIN performance_logs pl ON p.id = pl.user_id
LEFT JOIN room_assignments ra ON p.id = ra.student_id
LEFT JOIN rooms r ON ra.room_id = r.id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.email, ra.room_id, r.name;

-- ============================================================
-- UPDATE TRIGGER - Include role in profile creation
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, status)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        'active'
    );
    
    -- If role is faculty, create faculty_details
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'faculty' THEN
        INSERT INTO public.faculty_details (faculty_id, department, specialization, years_experience, status)
        VALUES (NEW.id, 'Nursing', NULL, 0, 'active');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE FUNCTION: Update Room Student Count
-- ============================================================

CREATE OR REPLACE FUNCTION update_room_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE rooms SET students_assigned = (
            SELECT COUNT(*) FROM room_assignments WHERE room_id = NEW.room_id
        ) WHERE id = NEW.room_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE rooms SET students_assigned = (
            SELECT COUNT(*) FROM room_assignments WHERE room_id = OLD.room_id
        ) WHERE id = OLD.room_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for room assignments
DROP TRIGGER IF EXISTS trigger_update_room_count ON room_assignments;

CREATE TRIGGER trigger_update_room_count
    AFTER INSERT OR DELETE ON room_assignments
    FOR EACH ROW EXECUTE FUNCTION update_room_student_count();

-- Add students_assigned column to rooms if not exists
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS students_assigned INTEGER DEFAULT 0;

-- Update existing room student counts
UPDATE rooms r SET students_assigned = (
    SELECT COUNT(*) FROM room_assignments WHERE room_id = r.id
);

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

GRANT ALL ON rooms TO authenticated;
GRANT ALL ON room_assignments TO authenticated;
GRANT ALL ON permissions TO authenticated;
GRANT ALL ON access_levels TO authenticated;
GRANT ALL ON system_config TO authenticated;
GRANT ALL ON faculty_details TO authenticated;

GRANT SELECT ON admin_dashboard_summary TO authenticated;
GRANT SELECT ON students_with_risk TO authenticated;