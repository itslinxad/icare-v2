"use client";

import { useState, useEffect } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
  avatar?: string;
}

interface FacultyStats {
  totalStudents: number;
  atRiskStudents: number;
  activeAlerts: number;
  completedReviews: number;
}

interface RecentActivity {
  id: string;
  type: 'alert' | 'review' | 'meeting' | 'report';
  title: string;
  description: string;
  timestamp: string;
}

interface Alert {
  id: string;
  studentName: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export default function FacultyDashboard() {
  const [stats, setStats] = useState<FacultyStats>({
    totalStudents: 0,
    atRiskStudents: 0,
    activeAlerts: 0,
    completedReviews: 0,
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setTimeout(() => {
        setStats({
          totalStudents: 47,
          atRiskStudents: 8,
          activeAlerts: 12,
          completedReviews: 156,
        });
        setStudents([
          { id: '1', name: 'Alex Thompson', email: 'alex.t@icare.edu', program: 'Computer Science', year: 3, riskLevel: 'high', lastActivity: '2 days ago' },
          { id: '2', name: 'Maria Garcia', email: 'maria.g@icare.edu', program: 'Engineering', year: 2, riskLevel: 'medium', lastActivity: '1 day ago' },
          { id: '3', name: 'James Wilson', email: 'james.w@icare.edu', program: 'Business', year: 4, riskLevel: 'low', lastActivity: 'Today' },
          { id: '4', name: 'Sarah Chen', email: 'sarah.c@icare.edu', program: 'Medicine', year: 1, riskLevel: 'medium', lastActivity: '3 days ago' },
          { id: '5', name: 'David Brown', email: 'david.b@icare.edu', program: 'Law', year: 3, riskLevel: 'low', lastActivity: 'Today' },
        ]);
        setActivities([
          { id: '1', type: 'alert', title: 'New Alert: Alex Thompson', description: 'Academic performance concern flagged', timestamp: '2 hours ago' },
          { id: '2', type: 'review', title: 'Case Review Completed', description: 'Maria Garcia - Progress meeting', timestamp: '5 hours ago' },
          { id: '3', type: 'meeting', title: 'Scheduled Meeting', description: 'With Academic Advisor - 3pm today', timestamp: 'Yesterday' },
          { id: '4', type: 'report', title: 'Monthly Report Generated', description: 'Analytics for January 2025', timestamp: '2 days ago' },
        ]);
        setAlerts([
          { id: '1', studentName: 'Alex Thompson', type: 'Academic Performance', severity: 'high', date: '2025-01-25', status: 'pending' },
          { id: '2', studentName: 'Maria Garcia', type: 'Attendance', severity: 'medium', date: '2025-01-24', status: 'reviewed' },
          { id: '3', studentName: 'Sarah Chen', type: 'Financial Aid', severity: 'low', date: '2025-01-23', status: 'pending' },
        ]);
        setLoading(false);
      }, 500);
    };
    loadDashboardData();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'alert': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'review': return 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4';
      case 'meeting': return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
      case 'report': return 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1B6B7B] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your students today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-[#1B6B7B] text-white rounded-xl font-medium hover:bg-[#145a63] transition-colors shadow-lg shadow-[#1B6B7B]/20 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Alert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+3</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{stats.totalStudents}</p>
          <p className="text-gray-500 text-sm mt-1">Total Students</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-xl">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Needs Attention</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{stats.atRiskStudents}</p>
          <p className="text-gray-500 text-sm mt-1">At-Risk Students</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 rounded-xl">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">New</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{stats.activeAlerts}</p>
          <p className="text-gray-500 text-sm mt-1">Active Alerts</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">This Month</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{stats.completedReviews}</p>
          <p className="text-gray-500 text-sm mt-1">Completed Reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My Students</h2>
              <p className="text-sm text-gray-500 mt-0.5">Students under your supervision</p>
            </div>
            <button className="text-sm text-[#1B6B7B] font-medium hover:text-[#145a63] transition-colors">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {students.map((student) => (
              <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1B6B7B] to-[#145a63] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{student.name}</p>
                      <p className="text-sm text-gray-500 truncate">{student.program} · Year {student.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)} Risk
                    </span>
                    <span className="text-xs text-gray-400">{student.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500 mt-0.5">Latest updates and actions</p>
          </div>
          <div className="p-4 space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getActivityIcon(activity.type)} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Alerts</h2>
            <p className="text-sm text-gray-500 mt-0.5">Alerts requiring your attention</p>
          </div>
          <button className="text-sm text-[#1B6B7B] font-medium hover:text-[#145a63] transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Alert Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{alert.studentName}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-600">{alert.type}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-500 text-sm">{alert.date}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      alert.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-sm text-[#1B6B7B] font-medium hover:text-[#145a63] transition-colors">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}