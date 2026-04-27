"use client";

import { useState } from "react";

interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  status: 'active' | 'inactive';
  student_count: number;
  years_experience: number;
}

const mockFaculty: Faculty[] = [
  { id: "1", name: "Dr. Maria Santos", email: "maria.santos@icare.edu", department: "Nursing", specialization: "Medical-Surgical Nursing", status: "active", student_count: 15, years_experience: 12 },
  { id: "2", name: "Prof. James Rivera", email: "james.rivera@icare.edu", department: "Nursing", specialization: "Maternal and Child Health", status: "active", student_count: 12, years_experience: 8 },
  { id: "3", name: "Ms. Anna Cruz", email: "anna.cruz@icare.edu", department: "Nursing", specialization: "Psychiatric Nursing", status: "active", student_count: 10, years_experience: 5 },
  { id: "4", name: "Mr. Robert Tan", email: "robert.tan@icare.edu", department: "Nursing", specialization: "Community Health", status: "inactive", student_count: 0, years_experience: 15 },
  { id: "5", name: "Dr. Carmen Lim", email: "carmen.lim@icare.edu", department: "Nursing", specialization: "Nursing Informatics", status: "active", student_count: 18, years_experience: 10 },
];

export default function FacultyClient() {
  const faculty = mockFaculty;
  const [facultyFilter, setFacultyFilter] = useState("all");

  const filteredFaculty = faculty.filter(f => facultyFilter === "all" || f.status === facultyFilter);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Management</h1>
        <p className="text-gray-500">Manage faculty members, track their specializations, and monitor student assignments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1B6B7B]/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B6B7B]/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#1B6B7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{faculty.length}</p>
              <p className="text-xs text-gray-500">Total Faculty</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1B6B7B]/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{faculty.filter(f => f.status === 'active').length}</p>
              <p className="text-xs text-gray-500">Active Faculty</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1B6B7B]/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{faculty.reduce((sum, f) => sum + f.student_count, 0)}</p>
              <p className="text-xs text-gray-500">Assigned Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B6B7B]/50 focus:border-[#1B6B7B] transition-all cursor-pointer"
        >
          <option value="all">All Faculty</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1B6B7B] text-white font-medium rounded-xl hover:bg-[#145a63] hover:shadow-lg transition-all duration-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Faculty
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1B6B7B]/30 transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Faculty Member</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Specialization</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Students</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Experience</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1B6B7B]/10 rounded-full flex items-center justify-center text-[#1B6B7B] font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{member.specialization}</td>
                  <td className="py-4 px-6">
                    <span className="text-gray-800 font-medium">{member.student_count}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{member.years_experience} years</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
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