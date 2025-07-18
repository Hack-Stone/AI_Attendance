import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  BookOpen,
  FileText,
  PieChart,
  Activity,
  Filter,
  RefreshCw,
  Eye,
  Mail,
  Printer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { mockStudents, mockSubjects, mockTeachers } from '../utils/mockData';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'overview', name: 'Overview Dashboard', icon: BarChart3 },
    { id: 'attendance', name: 'Attendance Analytics', icon: TrendingUp },
    { id: 'students', name: 'Student Performance', icon: Users },
    { id: 'subjects', name: 'Subject Analysis', icon: BookOpen },
    { id: 'faculty', name: 'Faculty Reports', icon: FileText }
  ];

  // Generate analytics data
  const attendanceData = [
    { month: 'Jan', attendance: 88, target: 85 },
    { month: 'Feb', attendance: 92, target: 85 },
    { month: 'Mar', attendance: 87, target: 85 },
    { month: 'Apr', attendance: 90, target: 85 },
    { month: 'May', attendance: 85, target: 85 },
    { month: 'Jun', attendance: 89, target: 85 }
  ];

  const semesterData = [
    { semester: 'Sem 2', students: 45, avgAttendance: 88, subjects: 5 },
    { semester: 'Sem 4', students: 42, avgAttendance: 85, subjects: 6 },
    { semester: 'Sem 6', students: 38, avgAttendance: 82, subjects: 6 },
    { semester: 'Sem 8', students: 35, avgAttendance: 90, subjects: 5 }
  ];

  const subjectPerformance = mockSubjects.map(subject => ({
    name: subject.name,
    code: subject.code,
    semester: subject.semester,
    avgAttendance: Math.round(75 + Math.random() * 20),
    totalStudents: mockStudents.filter(s => s.semester === subject.semester).length,
    passRate: Math.round(80 + Math.random() * 15)
  }));

  const attendanceDistribution = [
    { name: 'Excellent (90%+)', value: mockStudents.filter(s => s.attendance_percentage >= 90).length, color: '#10B981' },
    { name: 'Good (75-89%)', value: mockStudents.filter(s => s.attendance_percentage >= 75 && s.attendance_percentage < 90).length, color: '#3B82F6' },
    { name: 'Average (60-74%)', value: mockStudents.filter(s => s.attendance_percentage >= 60 && s.attendance_percentage < 75).length, color: '#F59E0B' },
    { name: 'Poor (<60%)', value: mockStudents.filter(s => s.attendance_percentage < 60).length, color: '#EF4444' }
  ];

  const handleGenerateReport = async (type: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        type,
        dateRange,
        semester: selectedSemester,
        generatedAt: new Date().toISOString(),
        data: getReportData(type)
      };

      // Simulate report generation
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report_${format(new Date(), 'yyyy-MM-dd')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`${type} report generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const getReportData = (type: string) => {
    switch (type) {
      case 'attendance':
        return { attendanceData, distribution: attendanceDistribution };
      case 'students':
        return mockStudents;
      case 'subjects':
        return subjectPerformance;
      case 'faculty':
        return mockTeachers;
      default:
        return { overview: 'Complete department analytics' };
    }
  };

  const handleEmailReport = (type: string) => {
    toast.success(`${type} report emailed to department head`);
  };

  const handlePrintReport = (type: string) => {
    window.print();
    toast.success(`${type} report sent to printer`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive attendance and performance analytics</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Semesters</option>
            <option value="2">Semester 2</option>
            <option value="4">Semester 4</option>
            <option value="6">Semester 6</option>
            <option value="8">Semester 8</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <motion.button
                key={report.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedReport(report.id)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  selectedReport === report.id
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">{report.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Overview Dashboard */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{mockStudents.length}</p>
                  <p className="text-sm text-green-600 mt-1">+5% from last month</p>
                </div>
                <Users className="h-12 w-12 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Attendance</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round(mockStudents.reduce((sum, s) => sum + s.attendance_percentage, 0) / mockStudents.length)}%
                  </p>
                  <p className="text-sm text-green-600 mt-1">+2% from last month</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Subjects</p>
                  <p className="text-3xl font-bold text-purple-600">{mockSubjects.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Across 4 semesters</p>
                </div>
                <BookOpen className="h-12 w-12 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faculty Members</p>
                  <p className="text-3xl font-bold text-indigo-600">{mockTeachers.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Active this semester</p>
                </div>
                <FileText className="h-12 w-12 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="attendance" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAttendance)" />
                  <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Attendance Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
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
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Analytics */}
      {selectedReport === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Semester-wise Attendance</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGenerateReport('attendance')}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? 'Generating...' : 'Export'}
                </button>
                <button
                  onClick={() => handleEmailReport('attendance')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={semesterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgAttendance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Subject Analysis */}
      {selectedReport === 'subjects' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Subject Performance Analysis</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGenerateReport('subjects')}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? 'Generating...' : 'Export'}
                </button>
                <button
                  onClick={() => handlePrintReport('subjects')}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Semester</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Students</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg Attendance</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectPerformance.map((subject, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{subject.name}</td>
                      <td className="py-3 px-4 text-gray-600">{subject.code}</td>
                      <td className="py-3 px-4 text-gray-600">{subject.semester}</td>
                      <td className="py-3 px-4 text-gray-600">{subject.totalStudents}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subject.avgAttendance >= 85 ? 'bg-green-100 text-green-800' :
                          subject.avgAttendance >= 75 ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {subject.avgAttendance}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{subject.passRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Report Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerateReport('daily')}
            className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all"
          >
            <Calendar className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium text-blue-700">Daily Report</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerateReport('weekly')}
            className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all"
          >
            <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium text-green-700">Weekly Summary</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerateReport('monthly')}
            className="flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all"
          >
            <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium text-purple-700">Monthly Analysis</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};