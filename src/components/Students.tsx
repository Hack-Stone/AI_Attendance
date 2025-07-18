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
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { mockStudents, mockTeachers } from '../utils/mockData';
import { Student } from '../types';
import { ProfileModal } from './ProfileModal';
import { 
  getStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} from '../utils/database';
import toast from 'react-hot-toast';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    student_id: '',
    semester: 2,
    year: 2024,
    section: 'A',
    parent_email: '',
    parent_phone: ''
  });

  const semesters = ['all', '2', '4', '6', '8'];
  const sections = ['all', 'A', 'B'];

  const filteredStudents = students
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

  const handleAddStudent = async () => {
    setLoading(true);
    try {
      const studentData = {
        ...newStudent,
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
        total_classes: 0,
        attended_classes: 0,
        attendance_percentage: 0
      };
      
      // In a real app, this would call the API
      const newStudentRecord = { ...studentData, id: Date.now().toString() };
      setStudents(prev => [...prev, newStudentRecord]);
      
      setShowAddModal(false);
      setNewStudent({
        name: '',
        email: '',
        student_id: '',
        semester: 2,
        year: 2024,
        section: 'A',
        parent_email: '',
        parent_phone: ''
      });
      toast.success('Student added successfully!');
    } catch (error) {
      toast.error('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      setStudents(prev => 
        prev.map(s => s.id === selectedStudent.id ? selectedStudent : s)
      );
      
      setShowEditModal(false);
      setSelectedStudent(null);
      toast.success('Student updated successfully!');
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}?`)) return;
    
    setLoading(true);
    try {
      setStudents(prev => prev.filter(s => s.id !== student.id));
      toast.success(`${student.name} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const handleImportStudents = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate import
        toast.success(`Importing ${file.name}...`);
        setTimeout(() => {
          toast.success('Students imported successfully!');
        }, 2000);
      }
    };
    input.click();
  };

  const handleExportStudents = () => {
    const csvContent = [
      ['Name', 'Student ID', 'Email', 'Semester', 'Section', 'Attendance %', 'Parent Email', 'Parent Phone'],
      ...filteredStudents.map(s => [
        s.name, s.student_id, s.email, s.semester, s.section, 
        s.attendance_percentage, s.parent_email, s.parent_phone
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Students exported successfully!');
  };

  const handleViewProfile = (student: Student) => {
    setProfileStudent(student);
    setShowProfileModal(true);
  };

  const handleAction = (action: string, student?: Student) => {
    switch (action) {
      case 'add':
        setShowAddModal(true);
        break;
      case 'edit':
        if (student) {
          setSelectedStudent(student);
          setShowEditModal(true);
        }
        break;
      case 'delete':
        if (student) handleDeleteStudent(student);
        break;
      case 'view':
        if (student) handleViewProfile(student);
        break;
      case 'email':
        toast.success(`Email sent to ${student?.parent_email}`);
        break;
      case 'export':
        handleExportStudents();
        break;
      case 'import':
        handleImportStudents();
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
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            {loading ? 'Importing...' : 'Import'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('export')}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Exporting...' : 'Export'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('add')}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add Student'}
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
                  onClick={() => handleAction('view', student)}
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

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Student</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                  <input
                    type="text"
                    value={newStudent.student_id}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, student_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <select
                      value={newStudent.semester}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, semester: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={2}>Semester 2</option>
                      <option value={4}>Semester 4</option>
                      <option value={6}>Semester 6</option>
                      <option value={8}>Semester 8</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                    <select
                      value={newStudent.section}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, section: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
                  <input
                    type="email"
                    value={newStudent.parent_email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, parent_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter parent email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone</label>
                  <input
                    type="tel"
                    value={newStudent.parent_phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, parent_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter parent phone"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  disabled={loading || !newStudent.name || !newStudent.student_id}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {showEditModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Student</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedStudent.name}
                    onChange={(e) => setSelectedStudent(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedStudent.email}
                    onChange={(e) => setSelectedStudent(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
                  <input
                    type="email"
                    value={selectedStudent.parent_email}
                    onChange={(e) => setSelectedStudent(prev => prev ? { ...prev, parent_email: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone</label>
                  <input
                    type="tel"
                    value={selectedStudent.parent_phone}
                    onChange={(e) => setSelectedStudent(prev => prev ? { ...prev, parent_phone: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditStudent}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setProfileStudent(null);
        }}
        person={profileStudent}
        type="student"
      />
    </motion.div>
  );
};