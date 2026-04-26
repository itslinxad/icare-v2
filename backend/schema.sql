-- iCARE++ Database Schema for Supabase (Fixed for Supabase Auth)
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table (simulated EHR)
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    room_number VARCHAR(50),
    diagnosis TEXT,
    vital_signs JSONB DEFAULT '{"heart_rate": null, "blood_pressure": null, "temperature": null, "respiratory_rate": null, "oxygen_saturation": null}'::jsonb,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    competencies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance logs table
CREATE TABLE IF NOT EXISTS performance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    quiz_id UUID REFERENCES quizzes(id),
    score INTEGER NOT NULL,
    time_taken INTEGER,
    answers JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trail table
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can create profile" ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own patients" ON patients FOR SELECT USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin')));
CREATE POLICY "Anyone can view patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create patients" ON patients FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update patients" ON patients FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Anyone can create quizzes" ON quizzes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can log performance" ON performance_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own performance" ON performance_logs FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin')));

CREATE POLICY "Authenticated users can create audit" ON audit_trail FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Faculty and admin can view all audit" ON audit_trail FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin')));

-- Create indexes for performance
CREATE INDEX idx_patients_created_by ON patients(created_by);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_performance_user_id ON performance_logs(user_id);
CREATE INDEX idx_performance_quiz_id ON performance_logs(quiz_id);
CREATE INDEX idx_audit_user_id ON audit_trail(user_id);

-- Insert sample data - Quizzes
INSERT INTO quizzes (title, description, difficulty, category) VALUES
('Vital Signs Assessment', 'Test your knowledge on monitoring vital signs', 'beginner', 'Nursing Foundations'),
('Patient Documentation', 'Learn proper clinical documentation', 'intermediate', 'Clinical Skills'),
('Clinical Decision Making', 'Case-based clinical reasoning', 'advanced', 'Critical Thinking');

-- Insert sample questions
INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies) 
SELECT 
    q.id,
    'What is the normal range for adult heart rate?',
    '["60-100 bpm", "50-80 bpm", "70-120 bpm", "80-140 bpm"]'::jsonb,
    0,
    'Normal adult heart rate ranges from 59 to 100 beats per minute.',
    '["Vital Signs", "Assessment"]'::jsonb
FROM quizzes q WHERE q.title = 'Vital Signs Assessment';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'What is the normal adult respiratory rate?',
    '["12-20 breaths/min", "8-12 breaths/min", "16-24 breaths/min", "20-28 breaths/min"]'::jsonb,
    0,
    'Normal adult respiratory rate is 12-20 breaths per minute.',
    '["Vital Signs", "Respiratory Assessment"]'::jsonb
FROM quizzes q WHERE q.title = 'Vital Signs Assessment';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'Which vital sign indicates potential infection?',
    '["Elevated temperature", "Normal pulse", "Low blood pressure", "Normal respiratory rate"]'::jsonb,
    0,
    'Fever (elevated temperature) is a common sign of infection.',
    '["Vital Signs", "Infection Assessment"]'::jsonb
FROM quizzes q WHERE q.title = 'Vital Signs Assessment';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'What is the normal blood pressure range?',
    '["120/80 mmHg or less", "140/90 mmHg or less", "100/60 mmHg or less", "130/85 mmHg or less"]'::jsonb,
    0,
    'Normal adult blood pressure is less than 120/80 mmHg.',
    '["Vital Signs", "Cardiovascular Assessment"]'::jsonb
FROM quizzes q WHERE q.title = 'Vital Signs Assessment';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'What is the normal oxygen saturation (SpO2) range?',
    '["95-100%", "90-95%", "85-90%", "80-85%"]'::jsonb,
    0,
    'Normal SpO2 is 95-100% in healthy adults.',
    '["Vital Signs", "Oxygenation"]'::jsonb
FROM quizzes q WHERE q.title = 'Vital Signs Assessment';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'What should be documented in patient notes?',
    '["All of the above", "Only vital signs", "Only medications", "Only complaints"]'::jsonb,
    0,
    'Complete documentation includes all relevant patient information.',
    '["Documentation", "Clinical Skills"]'::jsonb
FROM quizzes q WHERE q.title = 'Patient Documentation';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'When should patient vitals be reassessed?',
    '["Every 4-6 hours for stable patients", "Once a day", "Only when symptoms worsen", "Every 2 hours"]'::jsonb,
    0,
    'For stable patients, vital signs are typically reassessed every 4-6 hours.',
    '["Vital Signs", "Assessment Frequency"]'::jsonb
FROM quizzes q WHERE q.title = 'Patient Documentation';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'What is the priority when a patient shows symptoms?',
    '["Assess the patient immediately", "Check the chart", "Notify the doctor", "Document observations"]'::jsonb,
    0,
    'Patient safety is always the priority - assess immediately.',
    '["Clinical Decision", "Priority Setting"]'::jsonb
FROM quizzes q WHERE q.title = 'Clinical Decision Making';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'A patient has BP 160/95, HR 100, Temp 38.5C. What action is priority?',
    '["Notify the nurse/doctor", "Give medication", "Complete documentation", "Take vital signs again"]'::jsonb,
    0,
    'Elevated BP and fever indicate potential deterioration - notify healthcare provider.',
    '["Clinical Decision", "Critical Thinking"]'::jsonb
FROM quizzes q WHERE q.title = 'Clinical Decision Making';

INSERT INTO questions (quiz_id, content, options, correct_answer, explanation, competencies)
SELECT 
    q.id,
    'What is the first step in clinical decision making?',
    '["Assess the patient", "Review orders", "Administer medication", "Document"]'::jsonb,
    0,
    'Assessment is the first step in the nursing process.',
    '["Nursing Process", "Clinical Decision"]'::jsonb
FROM quizzes q WHERE q.title = 'Clinical Decision Making';

-- Insert sample patients
INSERT INTO patients (name, age, gender, room_number, diagnosis, vital_signs) VALUES
('Juan dela Cruz', 45, 'Male', 'Room 101', 'Hypertension', '{"heart_rate": 72, "blood_pressure": "140/90", "temperature": 36.5, "respiratory_rate": 16, "oxygen_saturation": 98}'::jsonb),
('Maria Santos', 32, 'Female', 'Room 102', 'Post-operative care', '{"heart_rate": 80, "blood_pressure": "120/80", "temperature": 37.0, "respiratory_rate": 18, "oxygen_saturation": 97}'::jsonb),
('Pedro Garcia', 58, 'Male', 'Room 103', 'Diabetes Type 2', '{"heart_rate": 76, "blood_pressure": "130/85", "temperature": 36.8, "respiratory_rate": 15, "oxygen_saturation": 96}'::jsonb),
('Ana Reyes', 28, 'Female', 'Room 104', 'Prenatal care', '{"heart_rate": 78, "blood_pressure": "110/70", "temperature": 36.6, "respiratory_rate": 16, "oxygen_saturation": 99}'::jsonb),
('Carlos Mendoza', 65, 'Male', 'Room 105', 'Pneumonia', '{"heart_rate": 88, "blood_pressure": "125/82", "temperature": 38.2, "respiratory_rate": 22, "oxygen_saturation": 94}'::jsonb);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 'student');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create view for student performance summary
CREATE OR REPLACE VIEW student_performance_summary AS
SELECT 
    p.id as student_id,
    p.full_name as student_name,
    p.email,
    COUNT(pl.id) as total_quizzes,
    COALESCE(AVG(pl.score), 0) as average_score,
    MAX(pl.created_at) as last_quiz_date
FROM profiles p
LEFT JOIN performance_logs pl ON p.id = pl.user_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.email;
