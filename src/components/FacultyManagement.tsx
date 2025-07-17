import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Mail,
  Phone,
  Download,
  Upload,
  UserPlus,
  GraduationCap,
  BookOpen,
  Users,
  Award
} from 'lucide-react';
import { mockTeachers } from '../utils/mockData';
import { Teacher } from '../types';
import toast from 'react-hot-toast';

export const FacultyManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    employee_id: '',
    subjects: [] as string[],
    semesters: [] as number[],
    sections: [] as string[]
  });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = async () => {
    setLoading(true);
    try {
      const teacherData = {
        ...newTeacher,
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`
      };
      
      const newTeacherRecord = { ...teacherData, id: Date.now().toString() };
      setTeachers(prev => [...prev, newTeacherRecord]);
      
      setShowAddModal(false);
      setNewTeacher({
        name: '',
        email: '',
        employee_id: '',
        subjects: [],
        semesters: [],
        sections: []
      });
      toast.success('Faculty member added successfully!');
    } catch (error) {
      toast.error('Failed to add faculty member');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = async () => {
    if (!selectedTeacher) return;
    
    setLoading(true);
    try {
      setTeachers(prev => 
        prev.map(t => t.id === selectedTeacher.id ? selectedTeacher : t)
      );
      
      setShowEditModal(false);
      setSelectedTeacher(null);
      toast.success('Faculty member updated successfully!');
    } catch (error) {
      toast.error('Failed to update faculty member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!confirm(`Are you sure you want to delete ${teacher.name}?`)) return;
    
    setLoading(true);
    try {
      setTeachers(prev => prev.filter(t => t.id !== teacher.id));
      toast.success(`${teacher.name} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete faculty member');
    } finally {
      setLoading(false);
    }
  };

  const handleImportTeachers = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Importing ${file.name}...`);
        setTimeout(() => {
          toast.success('Faculty data imported successfully!');
        }, 2000);
      }
    };
    input.click();
  };

  const handleExportTeachers = () => {
    const csvContent = [
      ['Name', 'Employee ID', 'Email', 'Subjects', 'Semesters', 'Sections'],
      ...filteredTeachers.map(t => [
        t.name, t.employee_id, t.email, 
        t.subjects.join(';'), t.semesters.join(';'), t.sections.join(';')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Faculty data exported successfully!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
            <GraduationCap className="h-8 w-8 text-purple-600 mr-3" />
            Faculty Management
          </h1>
          <p className="text-gray-600 mt-2">Manage Computer Science Department faculty members</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportTeachers}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            {loading ? 'Importing...' : 'Import'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportTeachers}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Exporting...' : 'Export'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add Faculty'}
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search faculty members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </motion.div>

      {/* Faculty Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
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
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{teacher.name}</h3>
                    <p className="text-sm text-gray-600">{teacher.employee_id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 flex items-center mb-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </span>
                  <span className="text-sm font-medium text-gray-900">{teacher.email}</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 flex items-center mb-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Subjects
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.slice(0, 2).map((subject, idx) => (
                      <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {subject}
                      </span>
                    ))}
                    {teacher.subjects.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{teacher.subjects.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <span className="text-xs text-gray-600">Semesters</span>
                    <p className="text-sm font-medium">{teacher.semesters.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Sections</span>
                    <p className="text-sm font-medium">{teacher.sections.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-gray-100">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setShowEditModal(true);
                  }}
                  className="flex items-center px-3 py-2 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.success(`Email sent to ${teacher.email}`)}
                  className="flex items-center px-3 py-2 text-xs text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Contact
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteTeacher(teacher)}
                  className="flex items-center px-3 py-2 text-xs text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Faculty Modal */}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Faculty Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter faculty name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={newTeacher.employee_id}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, employee_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter employee ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects (comma separated)</label>
                  <input
                    type="text"
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, subjects: e.target.value.split(',').map(s => s.trim()) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Data Structures, Algorithms"
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
                  onClick={handleAddTeacher}
                  disabled={loading || !newTeacher.name || !newTeacher.employee_id}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Faculty'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Faculty Modal */}
      <AnimatePresence>
        {showEditModal && selectedTeacher && (
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
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Faculty Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedTeacher.name}
                    onChange={(e) => setSelectedTeacher(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedTeacher.email}
                    onChange={(e) => setSelectedTeacher(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                  <input
                    type="text"
                    value={selectedTeacher.subjects.join(', ')}
                    onChange={(e) => setSelectedTeacher(prev => prev ? { ...prev, subjects: e.target.value.split(',').map(s => s.trim()) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTeacher(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTeacher}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Faculty'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Faculty Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-4 bg-purple-50 rounded-2xl mb-3 inline-block">
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{filteredTeachers.length}</p>
            <p className="text-sm text-gray-600">Total Faculty</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-blue-50 rounded-2xl mb-3 inline-block">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {new Set(filteredTeachers.flatMap(t => t.subjects)).size}
            </p>
            <p className="text-sm text-gray-600">Subjects Covered</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-green-50 rounded-2xl mb-3 inline-block">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {new Set(filteredTeachers.flatMap(t => t.semesters)).size}
            </p>
            <p className="text-sm text-gray-600">Active Semesters</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};