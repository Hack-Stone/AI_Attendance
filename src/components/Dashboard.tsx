import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  UserX,
  Target,
  BookOpen,
  GraduationCap,
  Award,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { mockStudents } from '../utils/mockData';
import { getCurrentUser } from '../utils/auth';

export const Dashboard: React.FC = () => {
  const user = getCurrentUser();
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Good Morning');
    else if (hour < 17) setTimeOfDay('Good Afternoon');
    else setTimeOfDay('Good Evening');
  }, []);

  // Calculate statistics
  const totalStudents = mockStudents.length;
  const presentToday = mockStudents.filter(s => Math.random() > 0.2).length;
  const absentToday = totalStudents - presentToday;
  const defaulters = mockStudents.filter(s => s.attendance_percentage < 75).length;
  const avgAttendance = Math.round(mockStudents.reduce((sum, s) => sum + s.attendance_percentage, 0) / totalStudents);

  // Chart data
  const weeklyData = [
    { day: 'Mon', attendance: 85, target: 80 },
    { day: 'Tue', attendance: 78, target: 80 },
    { day: 'Wed', attendance: 92, target: 80 },
    { day: 'Thu', attendance: 88, target: 80 },
    { day: 'Fri', attendance: 76, target: 80 },
    { day: 'Sat', attendance: 82, target: 80 },
  ];

  const semesterData = [
    { semester: 'Sem 2', students: 45, avgAttendance: 88 },
    { semester: 'Sem 4', students: 42, avgAttendance: 85 },
    { semester: 'Sem 6', students: 38, avgAttendance: 82 },
    { semester: 'Sem 8', students: 35, avgAttendance: 90 },
  ];

  const subjectData = [
    { subject: 'Data Structures', attendance: 88, color: '#3B82F6' },
    { subject: 'DBMS', attendance: 85, color: '#10B981' },
    { subject: 'Web Dev', attendance: 92, color: '#F59E0B' },
    { subject: 'ML', attendance: 78, color: '#EF4444' },
    { subject: 'Software Eng', attendance: 86, color: '#8B5CF6' },
  ];

  const attendanceDistribution = [
    { name: 'Excellent (90%+)', value: mockStudents.filter(s => s.attendance_percentage >= 90).length, color: '#10B981' },
    { name: 'Good (75-89%)', value: mockStudents.filter(s => s.attendance_percentage >= 75 && s.attendance_percentage < 90).length, color: '#3B82F6' },
    { name: 'Average (60-74%)', value: mockStudents.filter(s => s.attendance_percentage >= 60 && s.attendance_percentage < 75).length, color: '#F59E0B' },
    { name: 'Poor (&lt;60%)', value: mockStudents.filter(s => s.attendance_percentage < 60).length, color: '#EF4444' }
  ];

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+5%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Present Today',
      value: presentToday,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+2%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Absent Today',
      value: absentToday,
      icon: UserX,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      trend: '-3%',
      trendColor: 'text-red-600'
    },
    {
      title: 'Avg Attendance',
      value: `${avgAttendance}%`,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+1.2%',
      trendColor: 'text-green-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {timeOfDay}, {user?.name}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {user?.role === 'teacher' 
                  ? 'Manage Computer Science Department attendance with AI-powered insights.' 
                  : 'View your attendance records and academic performance.'}
              </p>
            </div>
            <div className="hidden md:block">
              <GraduationCap className="h-24 w-24 text-white/20" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.trendColor} flex items-center`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.trend} from last week
                  </p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                  <Icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trend */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Weekly Attendance Trend</h3>
              <p className="text-sm text-gray-500">CS Department performance</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="attendance" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorAttendance)"
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#EF4444" 
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject-wise Performance */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Subject Performance</h3>
              <p className="text-sm text-gray-500">Average attendance by subject</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="subject" type="category" stroke="#6b7280" width={80} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="attendance" 
                fill="#3B82F6"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Distribution */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Attendance Distribution</h3>
              <p className="text-sm text-gray-500">Student performance levels</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={attendanceDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${value}`}
              >
                {attendanceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {attendanceDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Defaulters */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Students Need Attention</h3>
              <p className="text-sm text-gray-500">Low attendance alerts</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="space-y-4">
            {mockStudents
              .filter(s => s.attendance_percentage < 80)
              .slice(0, 3)
              .map((student, index) => (
                <motion.div 
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        {student.student_id} • Semester {student.semester} - Section {student.section}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{student.attendance_percentage}%</p>
                    <p className="text-xs text-red-500 font-medium">Below threshold</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Calendar className="h-5 w-5 mr-2" />
            <span className="font-medium">Mark Attendance</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            <span className="font-medium">Generate Report</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="font-medium">Send Alerts</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};