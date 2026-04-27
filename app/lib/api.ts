export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room_number: string;
  diagnosis: string;
  vital_signs: {
    heart_rate: number | null;
    blood_pressure: string | null;
    temperature: number | null;
    respiratory_rate: number | null;
    oxygen_saturation: number | null;
  };
  created_by: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  content: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  competencies: string[];
}

export interface PerformanceLog {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  time_taken: number;
  answers: { question_id: string; answer: number; correct: boolean }[];
  created_at: string;
}

export async function login(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('icare_user', JSON.stringify(data.user));
        localStorage.setItem('icare_token', 'logged_in');
      }
      return { user: data.user, sessionToken: 'logged_in' };
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function register(email: string, password: string, name: string, role: string = 'student'): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Register error:', error);
    return null;
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('icare_user');
    localStorage.removeItem('icare_token');
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('icare_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('icare_token') === 'logged_in';
}

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const response = await fetch(`${API_URL}/patients`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.patients || [];
  } catch (error) {
    console.error('Fetch patients error:', error);
    return [];
  }
}

export async function fetchQuizzes(): Promise<Quiz[]> {
  try {
    const response = await fetch(`${API_URL}/quizzes`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.quizzes || [];
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    return [];
  }
}

export async function fetchQuizQuestions(quizId: string): Promise<Question[]> {
  try {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/questions`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('Fetch questions error:', error);
    return [];
  }
}

export async function submitPerformance(
  userId: string,
  quizId: string,
  score: number,
  timeTaken: number,
  answers: { question_id: string; answer: number; correct: boolean }[]
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/performance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, quiz_id: quizId, score, time_taken: timeTaken, answers }),
    });

    return response.ok;
  } catch (error) {
    console.error('Submit performance error:', error);
    return false;
  }
}

export async function fetchStudentPerformance(studentId: string): Promise<PerformanceLog[]> {
  try {
    const response = await fetch(`${API_URL}/performance/student/${studentId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.logs || [];
  } catch (error) {
    console.error('Fetch student performance error:', error);
    return [];
  }
}

// Faculty API Types
export interface FacultyStats {
  total_students: number;
  at_risk_students: number;
  active_alerts: number;
  completed_reviews: number;
  active_scenarios: number;
  pending_scenarios: number;
}

export interface FacultyStudent {
  id: string;
  student_id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  average_score: number;
  quiz_count: number;
  risk_level: 'low' | 'medium' | 'high';
  last_activity: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  patient_case: any;
  learning_objectives: string[];
  is_ai_generated: boolean;
  student_count: number;
  created_at: string;
}

export interface FacultyNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  is_read: boolean;
  created_at: string;
  student_id?: string;
}

export interface FacultyAlert {
  id: string;
  student_id: string;
  student_name: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface FacultyReport {
  id: string;
  student_id: string;
  student_name: string;
  report_type: string;
  generated_at: string;
  pdf_url: string | null;
}

export interface FacultyPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room_number: string;
  diagnosis: string;
  admission_date: string;
  vital_signs: {
    heart_rate: number;
    blood_pressure: string;
    temperature: number;
    respiratory_rate: number;
    oxygen_saturation: number;
  };
  labs: any;
  mimic_id: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
}

export interface FacultyAnalytics {
  cohort_performance: {
    average_score: number;
    total_quizzes: number;
    completion_rate: number;
    improvement_trend: string;
  };
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  competency_breakdown: Record<string, number>;
  performance_trend: { week: string; average: number }[];
  ml_insights: { type: string; message: string; priority: string }[];
}

// Faculty API Functions
export async function fetchFacultyDashboard(): Promise<{ stats: FacultyStats; recent_activities: AuditLog[] } | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/dashboard`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? { stats: data.stats, recent_activities: data.recent_activities } : null;
  } catch (error) {
    console.error('Fetch faculty dashboard error:', error);
    return null;
  }
}

export async function fetchFacultyStudents(riskLevel?: string, search?: string): Promise<FacultyStudent[]> {
  try {
    const params = new URLSearchParams();
    if (riskLevel && riskLevel !== 'all') params.append('risk_level', riskLevel);
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_URL}/faculty/students?${params}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.students : [];
  } catch (error) {
    console.error('Fetch faculty students error:', error);
    return [];
  }
}

export async function fetchFacultyStudentDetail(studentId: string): Promise<{ student: FacultyStudent; performance_history: any[]; competencies: Record<string, number> } | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/students/${studentId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Fetch student detail error:', error);
    return null;
  }
}

export async function fetchAtRiskStudents(): Promise<FacultyStudent[]> {
  try {
    const response = await fetch(`${API_URL}/faculty/at-risk`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.students : [];
  } catch (error) {
    console.error('Fetch at-risk students error:', error);
    return [];
  }
}

export async function fetchFacultyScenarios(): Promise<SimulationScenario[]> {
  try {
    const response = await fetch(`${API_URL}/faculty/scenarios`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.scenarios : [];
  } catch (error) {
    console.error('Fetch scenarios error:', error);
    return [];
  }
}

export async function createScenario(scenario: Partial<SimulationScenario>): Promise<SimulationScenario | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.scenario : null;
  } catch (error) {
    console.error('Create scenario error:', error);
    return null;
  }
}

export async function generateAIScenario(prompt: string): Promise<SimulationScenario | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/scenarios/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.scenario : null;
  } catch (error) {
    console.error('Generate AI scenario error:', error);
    return null;
  }
}

export async function fetchFacultyPatients(): Promise<FacultyPatient[]> {
  try {
    const response = await fetch(`${API_URL}/faculty/patients`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.patients : [];
  } catch (error) {
    console.error('Fetch patients error:', error);
    return [];
  }
}

export async function fetchFacultyPatientDetail(patientId: string): Promise<{ patient: FacultyPatient; clinical_decision_support: any } | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/patients/${patientId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Fetch patient detail error:', error);
    return null;
  }
}

export async function fetchFacultyReports(): Promise<FacultyReport[]> {
  try {
    const response = await fetch(`${API_URL}/faculty/reports`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.reports : [];
  } catch (error) {
    console.error('Fetch reports error:', error);
    return [];
  }
}

export async function generateFacultyReport(studentId: string, reportType: string = 'competency'): Promise<FacultyReport | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, report_type: reportType }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.report : null;
  } catch (error) {
    console.error('Generate report error:', error);
    return null;
  }
}

export async function fetchFacultyNotifications(): Promise<{ notifications: FacultyNotification[]; total: number; unread: number } | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/notifications`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? { notifications: data.notifications, total: data.total, unread: data.unread } : null;
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return null;
  }
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/faculty/notifications/${notificationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: true }),
    });
    return response.ok;
  } catch (error) {
    console.error('Mark notification read error:', error);
    return false;
  }
}

export async function fetchFacultyAlerts(status?: string): Promise<{ alerts: FacultyAlert[]; total: number; pending: number } | null> {
  try {
    const params = status && status !== 'all' ? `?status=${status}` : '';
    const response = await fetch(`${API_URL}/faculty/alerts${params}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? { alerts: data.alerts, total: data.total, pending: data.pending } : null;
  } catch (error) {
    console.error('Fetch alerts error:', error);
    return null;
  }
}

export async function updateAlertStatus(alertId: string, status: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/faculty/alerts/${alertId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch (error) {
    console.error('Update alert error:', error);
    return false;
  }
}

export async function createAlert(alert: Partial<FacultyAlert>): Promise<FacultyAlert | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.alert : null;
  } catch (error) {
    console.error('Create alert error:', error);
    return null;
  }
}

export async function fetchAuditTrail(action?: string): Promise<AuditLog[]> {
  try {
    const params = action && action !== 'all' ? `?action=${action}` : '';
    const response = await fetch(`${API_URL}/faculty/audit-trail${params}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.audit_logs : [];
  } catch (error) {
    console.error('Fetch audit trail error:', error);
    return [];
  }
}

export async function fetchFacultyAnalytics(): Promise<FacultyAnalytics | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/analytics`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.analytics : null;
  } catch (error) {
    console.error('Fetch analytics error:', error);
    return null;
  }
}

export async function predictStudentRisk(studentId: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/ml/predict-risk/${studentId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.prediction : null;
  } catch (error) {
    console.error('Predict student risk error:', error);
    return null;
  }
}

export async function getClinicalDecisionSupport(patientCase: any): Promise<any | null> {
  try {
    const response = await fetch(`${API_URL}/faculty/clinical-support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_case: patientCase }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.support : null;
  } catch (error) {
    console.error('Get clinical support error:', error);
    return null;
  }
}