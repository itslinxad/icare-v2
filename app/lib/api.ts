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