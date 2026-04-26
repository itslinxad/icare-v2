"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
}

function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('icare_user');
  return userStr ? JSON.parse(userStr) : null;
}

function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('icare_user');
    localStorage.removeItem('icare_token');
  }
}

interface StudentPerformance {
  id: string;
  name: string;
  email: string;
  quizzes_completed: number;
  average_score: number;
  at_risk: boolean;
  last_active: string;
}

const mockStudents: StudentPerformance[] = [
  { id: "1", name: "John Smith", email: "john@icare.edu", quizzes_completed: 8, average_score: 88, at_risk: false, last_active: "Today" },
  { id: "2", name: "Sarah Johnson", email: "sarah@icare.edu", quizzes_completed: 6, average_score: 75, at_risk: false, last_active: "Yesterday" },
  { id: "3", name: "Mike Williams", email: "mike@icare.edu", quizzes_completed: 3, average_score: 45, at_risk: true, last_active: "3 days ago" },
  { id: "4", name: "Emily Brown", email: "emily@icare.edu", quizzes_completed: 9, average_score: 92, at_risk: false, last_active: "Today" },
  { id: "5", name: "David Lee", email: "david@icare.edu", quizzes_completed: 5, average_score: 62, at_risk: true, last_active: "2 days ago" },
  { id: "6", name: "Lisa Garcia", email: "lisa@icare.edu", quizzes_completed: 7, average_score: 81, at_risk: false, last_active: "Today" },
  { id: "7", name: "James Wilson", email: "james@icare.edu", quizzes_completed: 4, average_score: 55, at_risk: true, last_active: "1 week ago" },
  { id: "8", name: "Anna Martinez", email: "anna@icare.edu", quizzes_completed: 8, average_score: 85, at_risk: false, last_active: "Today" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students] = useState<StudentPerformance[]>(mockStudents);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
    } else if (currentUser.role === 'student') {
      router.push("/dashboard");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "all" || 
                      (riskFilter === "at-risk" && s.at_risk) ||
                      (riskFilter === "safe" && !s.at_risk);
    return matchesSearch && matchesRisk;
  });

  const atRiskStudents = students.filter(s => s.at_risk);
  const totalStudents = students.length;
  const averageScore = Math.round(students.reduce((sum, s) => sum + s.average_score, 0) / students.length);
  const totalQuizzes = students.reduce((sum, s) => sum + s.quizzes_completed, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-[#1B6B7B] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">iCARE++</h1>
          <p className="text-sm text-white/70">Faculty Portal</p>
        </div>
        
        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              activeTab === "overview" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              activeTab === "students" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Students
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              activeTab === "analytics" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              activeTab === "reports" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
          </button>
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
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "overview" && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Faculty Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
                    <p className="text-sm text-gray-500">Total Students</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{atRiskStudents.length}</p>
                    <p className="text-sm text-gray-500">At Risk</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{averageScore}%</p>
                    <p className="text-sm text-gray-500">Avg. Score</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalQuizzes}</p>
                    <p className="text-sm text-gray-500">Quizzes Taken</p>
                  </div>
                </div>
              </div>
            </div>

            {atRiskStudents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Students Requiring Attention</h3>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                    {atRiskStudents.length} at risk
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {atRiskStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">{student.average_score}%</p>
                        <p className="text-sm text-gray-500">{student.quizzes_completed} quizzes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Management</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B7B]"
              />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B7B]"
              >
                <option value="all">All Students</option>
                <option value="at-risk">At Risk</option>
                <option value="safe">Safe</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Quizzes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Avg. Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.quizzes_completed}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          student.average_score >= 70 ? "text-green-600" : "text-red-600"
                        }`}>
                          {student.average_score}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-sm rounded ${
                          student.at_risk ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {student.at_risk ? "At Risk" : "Safe"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.last_active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Performance Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">90-100%</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }} />
                    </div>
                    <span className="text-sm text-gray-500">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">70-89%</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: '37.5%' }} />
                    </div>
                    <span className="text-sm text-gray-500">37.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">50-69%</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '25%' }} />
                    </div>
                    <span className="text-sm text-gray-500">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">&lt;50%</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: '12.5%' }} />
                    </div>
                    <span className="text-sm text-gray-500">12.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Quiz Completion by Category</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vital Signs</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Documentation</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }} />
                    </div>
                    <span className="text-sm text-gray-500">72%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Clinical Decision</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '58%' }} />
                    </div>
                    <span className="text-sm text-gray-500">58%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Export</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#1B6B7B] transition-colors text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Competency Report</p>
                    <p className="text-sm text-gray-500">Generate student competency PDF</p>
                  </div>
                </div>
              </button>

              <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#1B6B7B] transition-colors text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">At-Risk Students</p>
                    <p className="text-sm text-gray-500">List students needing intervention</p>
                  </div>
                </div>
              </button>

              <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#1B6B7B] transition-colors text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Analytics Summary</p>
                    <p className="text-sm text-gray-500">Performance analytics report</p>
                  </div>
                </div>
              </button>

              <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#1B6B7B] transition-colors text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Activity Log</p>
                    <p className="text-sm text-gray-500">System activity audit trail</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}