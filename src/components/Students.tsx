import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  UserPlus,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { mockStudents } from '../utils/mockData';
import { Student } from '../types';
import toast from 'react-hot-toast';

export const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const semesters = ['all', '2', '4', '6', '8'];
  const sections = ['all', 'A', 'B'];

  const filteredStudents = mockStudents
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSemester = selectedSemester === 'all' || student.semester.toString() === selectedSemester;
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      
      return matchesSearch && matchesSemester && matchesSection;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attendance':
          return b.attendance_percentage - a.attendance_percentage;
        case 'student_id':
          return a.student_id.localeCompare(b.student_id);
        default:
          return 0;
      }
    });

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const handleAction = (action: string, student?: Student) => {
    switch (action) {
      case 'add':
        setShowAddModal(true);
        break;
      case 'edit':
        setSelectedStudent(student || null);
        break;
      case 'delete':
        toast.success(`Student ${student?.name} deleted successfully`);
        break;
      case 'email':
        toast.success(`Email sent to ${student?.parent_email}`);
        break;
      case 'export':
        toast.success('Student data exported successfully');
        break;
      case 'import':
        toast.success('Student data imported successfully');
        break;
      default:
        break;
    }
  };

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
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            Student Management
          </h1>
          <p className="text-gray-600 mt-2">Manage Computer Science Department students</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('import')}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('export')}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('add')}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {semesters.map(sem => (
              <option key={sem} value={sem}>
                {sem === 'all' ? 'All Semesters' : `Semester ${sem}`}
              </option>
            ))}
          </select>
          
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {sections.map(section => (
              <option key={section} value={section}>
                {section === 'all' ? 'All Sections' : `Section ${section}`}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="name">Sort by Name</option>
            <option value="attendance">Sort by Attendance</option>
            <option value="student_id">Sort by Student ID</option>
          </select>
        </div>
      </motion.div>

      {/* Students Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.student_id}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Semester & Section
                  </span>
                  <span className="text-sm font-medium">Sem {student.semester} - {student.section}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attendance</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${getAttendanceColor(student.attendance_percentage)}`}>
                    {student.attendance_percentage}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Classes</span>
                  <span className="text-sm font-medium">{student.attended_classes}/{student.total_classes}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      student.attendance_percentage >= 85 ? 'bg-green-500' :
                      student.attendance_percentage >= 75 ? 'bg-blue-500' :
                      student.attendance_percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${student.attendance_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-gray-100">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-2 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction('edit', student)}
                  className="flex items-center px-3 py-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction('email', student)}
                  className="flex items-center px-3 py-2 text-xs text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Contact
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredStudents.length === 0 && (
        <motion.div 
          variants={itemVariants}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Summary Stats */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Department Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-4 bg-blue-50 rounded-2xl mb-3 inline-block">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{filteredStudents.length}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-green-50 rounded-2xl mb-3 inline-block">
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {filteredStudents.filter(s => s.attendance_percentage >= 85).length}
            </p>
            <p className="text-sm text-gray-600">Excellent (85%+)</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-amber-50 rounded-2xl mb-3 inline-block">
              <BookOpen className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {filteredStudents.filter(s => s.attendance_percentage >= 75 && s.attendance_percentage < 85).length}
            </p>
            <p className="text-sm text-gray-600">Good (75-84%)</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-red-50 rounded-2xl mb-3 inline-block">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              {filteredStudents.filter(s => s.attendance_percentage < 75).length}
            </p>
            <p className="text-sm text-gray-600">Need Attention</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};