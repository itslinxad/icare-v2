"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { logout, isAuthenticated, getCurrentUser, User, fetchStudentScenarioAssignments } from "../lib/api";

interface ScenarioAssignment {
  id: string;
  scenario_id: string;
  scenario_title: string;
  assigned_at: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  required: boolean;
  score?: number;
}

interface Patient {
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
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Juan dela Cruz",
    age: 45,
    gender: "Male",
    room_number: "Room 101",
    diagnosis: "Hypertension",
    vital_signs: { heart_rate: 72, blood_pressure: "140/90", temperature: 36.5, respiratory_rate: 16, oxygen_saturation: 98 },
  },
  {
    id: "2",
    name: "Maria Santos",
    age: 32,
    gender: "Female",
    room_number: "Room 102",
    diagnosis: "Post-operative care",
    vital_signs: { heart_rate: 80, blood_pressure: "120/80", temperature: 37.0, respiratory_rate: 18, oxygen_saturation: 97 },
  },
  {
    id: "3",
    name: "Pedro Garcia",
    age: 58,
    gender: "Male",
    room_number: "Room 103",
    diagnosis: "Diabetes Type 2",
    vital_signs: { heart_rate: 76, blood_pressure: "130/85", temperature: 36.8, respiratory_rate: 15, oxygen_saturation: 96 },
  },
  {
    id: "4",
    name: "Ana Reyes",
    age: 28,
    gender: "Female",
    room_number: "Room 104",
    diagnosis: "Prenatal care",
    vital_signs: { heart_rate: 78, blood_pressure: "110/70", temperature: 36.6, respiratory_rate: 16, oxygen_saturation: 99 },
  },
  {
    id: "5",
    name: "Carlos Mendoza",
    age: 65,
    gender: "Male",
    room_number: "Room 105",
    diagnosis: "Pneumonia",
    vital_signs: { heart_rate: 88, blood_pressure: "125/82", temperature: 38.2, respiratory_rate: 22, oxygen_saturation: 94 },
  },
];

const mockQuizzes: Quiz[] = [
  { id: "1", title: "Vital Signs Assessment", description: "Test your knowledge on monitoring vital signs", difficulty: "beginner", category: "Nursing Foundations" },
  { id: "2", title: "Patient Documentation", description: "Learn proper clinical documentation", difficulty: "intermediate", category: "Clinical Skills" },
  { id: "3", title: "Clinical Decision Making", description: "Case-based clinical reasoning", difficulty: "advanced", category: "Critical Thinking" },
];

const menuItems = [
  { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard", path: "/dashboard" },
  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "Patients", path: "/patients" },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", label: "Quizzes", path: "/quizzes" },
  { icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.414 1.414.586 3.414-1.414 3.414H12m8 0h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2", label: "Scenarios", path: "/scenarios" },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Performance", path: "/performance" },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patients] = useState<Patient[]>(mockPatients);
  const [quizzes] = useState<Quiz[]>(mockQuizzes);
  const [scenarioAssignments, setScenarioAssignments] = useState<ScenarioAssignment[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
      loadScenarioAssignments(currentUser.id);
    }
  }, [router]);

  const loadScenarioAssignments = async (studentId: string) => {
    const assignments = await fetchStudentScenarioAssignments(studentId);
    setScenarioAssignments(assignments);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getVitalStatus = (vital: number | null, type: string): { status: string; color: string } => {
    if (vital === null) return { status: "N/A", color: "text-gray-400" };
    
    const ranges = {
      heart_rate: { low: 60, high: 100 },
      temperature: { low: 36.1, high: 37.2 },
      respiratory_rate: { low: 12, high: 20 },
      oxygen_saturation: { low: 95, high: 100 },
    };
    
    const range = ranges[type as keyof typeof ranges];
    if (!range) return { status: "Normal", color: "text-green-600" };
    
    if (vital < range.low) return { status: "Low", color: "text-yellow-600" };
    if (vital > range.high) return { status: "High", color: "text-red-600" };
    return { status: "Normal", color: "text-green-600" };
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-[#1B6B7B] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">iCARE++</h1>
          <p className="text-sm text-white/70">Student Portal</p>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Patients") setActiveTab("patients");
                else if (item.label === "Quizzes") setActiveTab("quizzes");
                else if (item.label === "Scenarios") setActiveTab("scenarios");
                else if (item.label === "Performance") setActiveTab("performance");
                else setActiveTab("dashboard");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === item.label.toLowerCase() || 
                (item.label === "Patients" && activeTab === "patients") ||
(item.label === "Quizzes" && activeTab === "quizzes") ||
                 (item.label === "Performance" && activeTab === "performance")
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
              {item.label === "Scenarios" && scenarioAssignments.length > 0 && (
                <span className="ml-auto bg-white/30 text-xs px-2 py-0.5 rounded-full">
                  {scenarioAssignments.filter(a => a.status !== 'completed').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-white/70">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "patients" && "Patient Records"}
            {activeTab === "quizzes" && "Adaptive Quizzes"}
            {activeTab === "performance" && "My Performance"}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">5</p>
                      <p className="text-sm text-gray-500">Assigned Patients</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">3</p>
                      <p className="text-sm text-gray-500">Quizzes Completed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">85%</p>
                      <p className="text-sm text-gray-500">Average Score</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">2h</p>
                      <p className="text-sm text-gray-500">Study Time Today</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Recent Patients</h3>
                  <div className="space-y-3">
                    {patients.slice(0, 3).map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{patient.name}</p>
                            <p className="text-sm text-gray-500">{patient.room_number}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                          {patient.diagnosis}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Recommended Quizzes</h3>
                  <div className="space-y-3">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{quiz.title}</p>
                          <p className="text-sm text-gray-500">{quiz.category}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Patient List</h3>
                  <span className="text-sm text-gray-500">{patients.length} patients assigned</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Room</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Diagnosis</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">HR</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">BP</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Temp</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">RR</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">SpO2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                                {patient.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{patient.name}</p>
                                <p className="text-xs text-gray-500">{patient.age}yo {patient.gender}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{patient.room_number}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                              {patient.diagnosis}
                            </span>
                          </td>
                          <td className={`py-3 px-4 font-medium ${getVitalStatus(patient.vital_signs.heart_rate, 'heart_rate').color}`}>
                            {patient.vital_signs.heart_rate ?? "—"}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{patient.vital_signs.blood_pressure ?? "—"}</td>
                          <td className={`py-3 px-4 font-medium ${getVitalStatus(patient.vital_signs.temperature, 'temperature').color}`}>
                            {patient.vital_signs.temperature ?? "—"}°C
                          </td>
                          <td className={`py-3 px-4 font-medium ${getVitalStatus(patient.vital_signs.respiratory_rate, 'respiratory_rate').color}`}>
                            {patient.vital_signs.respiratory_rate ?? "—"}
                          </td>
                          <td className={`py-3 px-4 font-medium ${getVitalStatus(patient.vital_signs.oxygen_saturation, 'oxygen_saturation').color}`}>
                            {patient.vital_signs.oxygen_saturation ?? "—"}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "quizzes" && (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{quiz.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{quiz.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                          {quiz.category}
                        </span>
                        <span className={`px-2 py-1 text-sm rounded ${
                          quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-[#1B6B7B] text-white rounded-lg hover:bg-[#155663] transition-colors">
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "scenarios" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-[#1B6B7B]">{scenarioAssignments.filter(a => a.status === 'pending').length}</p>
                  <p className="text-gray-500 mt-2">Pending</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-[#1B6B7B]">{scenarioAssignments.filter(a => a.status === 'in_progress').length}</p>
                  <p className="text-gray-500 mt-2">In Progress</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-emerald-600">{scenarioAssignments.filter(a => a.status === 'completed').length}</p>
                  <p className="text-gray-500 mt-2">Completed</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Assigned Scenarios</h3>
                {scenarioAssignments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No scenarios assigned yet</p>
                ) : (
                  <div className="space-y-3">
                    {scenarioAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-800">{assignment.scenario_title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                              assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              assignment.status === 'overdue' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {assignment.status.replace('_', ' ')}
                            </span>
                            {assignment.required && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                                Required
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Due: {assignment.deadline}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {assignment.score !== undefined && (
                            <span className={`text-lg font-bold ${
                              assignment.score >= 80 ? 'text-emerald-600' :
                              assignment.score >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {assignment.score}%
                            </span>
                          )}
                          <button 
                            onClick={() => router.push(`/scenarios/${assignment.scenario_id}`)}
                            className="px-4 py-2 bg-[#1B6B7B] text-white rounded-lg hover:bg-[#155663] transition-colors"
                          >
                            {assignment.status === 'completed' ? 'Review' : assignment.status === 'in_progress' ? 'Continue' : 'Start'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-[#1B6B7B]">85%</p>
                  <p className="text-gray-500 mt-2">Average Score</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-[#1B6B7B]">3</p>
                  <p className="text-gray-500 mt-2">Quizzes Completed</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-4xl font-bold text-[#1B6B7B]">12m</p>
                  <p className="text-gray-500 mt-2">Avg. Time per Quiz</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Performance History</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Vital Signs Assessment</p>
                      <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">90%</p>
                      <p className="text-sm text-gray-500">10 min</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Patient Documentation</p>
                      <p className="text-sm text-gray-500">Yesterday, 2:15 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">80%</p>
                      <p className="text-sm text-gray-500">15 min</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Clinical Decision Making</p>
                      <p className="text-sm text-gray-500">Apr 24, 9:00 AM</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">70%</p>
                      <p className="text-sm text-gray-500">20 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}