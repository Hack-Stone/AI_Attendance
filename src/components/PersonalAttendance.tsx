import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  BookOpen,
  AlertTriangle,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getCurrentUser } from '../utils/auth';
import { mockStudents, mockSubjects } from '../utils/mockData';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

export const PersonalAttendance: React.FC = () => {
  const user = getCurrentUser();
  const currentStudent = mockStudents.find(s => s.student_id === user?.student_id) || mockStudents[0];
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Get subjects for current student's semester
  const studentSubjects = mockSubjects.filter(subject => 
    subject.semester === currentStudent.semester
  );

  // Generate attendance data for charts
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      day: format(date, 'EEE'),
      date: format(date, 'MMM dd'),
      present: Math.random() > 0.2 ? 1 : 0,
      total: 1
    };
  });

  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, 'MMM dd'),
      attendance: Math.round(75 + Math.random() * 20)
    };
  });

  const subjectWiseData = studentSubjects.map(subject => ({
    subject: subject.name,
    attendance: Math.round(75 + Math.random() * 20),
    total: 30,
    present: Math.round((75 + Math.random() * 20) * 30 / 100)
  }));

  const attendanceDistribution = [
    { name: 'Present', value: currentStudent.attended_classes, color: '#10B981' },
    { name: 'Absent', value: currentStudent.total_classes - currentStudent.attended_classes, color: '#EF4444' }
  ];

  // Generate detailed attendance records
  const attendanceRecords = Array.from({ length: 20 }, (_, i) => {
    const date = subDays(new Date(), i);
    const subject = studentSubjects[Math.floor(Math.random() * studentSubjects.length)];
    const statuses = ['present', 'absent', 'late'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: i + 1,
      date: format(date, 'yyyy-MM-dd'),
      subject: subject.name,
      status,
      time: '09:00 AM',
      teacher: 'Dr. Rajesh Kumar'
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'absent':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'late':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4" />;
      case 'absent':
        return <XCircle className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const exportAttendance = () => {
    const csvContent = [
      ['Date', 'Subject', 'Status', 'Time', 'Teacher'],
      ...attendanceRecords.map(record => [
        record.date,
        record.subject,
        record.status,
        record.time,
        record.teacher
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            My Attendance Records
          </h1>
          <p className="text-gray-600 mt-2">Track your attendance progress and performance</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAttendance}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Attendance</p>
              <p className="text-3xl font-bold text-blue-600">{currentStudent.attendance_percentage}%</p>
              <p className="text-sm text-gray-500 mt-1">
                {currentStudent.attended_classes}/{currentStudent.total_classes} classes
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Classes Attended</p>
              <p className="text-3xl font-bold text-green-600">{currentStudent.attended_classes}</p>
              <p className="text-sm text-green-600 mt-1">This semester</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Classes Missed</p>
              <p className="text-3xl font-bold text-red-600">{currentStudent.total_classes - currentStudent.attended_classes}</p>
              <p className="text-sm text-red-600 mt-1">This semester</p>
            </div>
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-lg font-bold ${currentStudent.attendance_percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                {currentStudent.attendance_percentage >= 75 ? 'Good Standing' : 'At Risk'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentStudent.attendance_percentage >= 75 ? 'Above 75% requirement' : 'Below 75% requirement'}
              </p>
            </div>
            {currentStudent.attendance_percentage >= 75 ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {attendanceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Subject-wise Attendance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectWiseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Records */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Recent Attendance Records</h3>
              <p className="text-sm text-gray-600">Last 20 class sessions</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Subjects</option>
                {studentSubjects.map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Subject</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Time</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Teacher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceRecords
                .filter(record => selectedSubject === 'all' || record.subject === selectedSubject)
                .map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-900">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{record.subject}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{record.time}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1 capitalize">{record.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{record.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Alerts */}
      {currentStudent.attendance_percentage < 75 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Attendance Alert
              </h3>
              <p className="text-red-700 mb-4">
                Your attendance is below the required 75% threshold. You need to attend more classes to meet the minimum requirement.
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Recommendations:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Attend all upcoming classes regularly</li>
                  <li>• Contact your faculty advisor for guidance</li>
                  <li>• Consider applying for medical leave if you're unwell</li>
                  <li>• Review the attendance policy in your student handbook</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};