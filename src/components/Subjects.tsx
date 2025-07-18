import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Calendar,
  Clock,
  Award,
  Search,
  Filter,
  X
} from 'lucide-react';
import { mockSubjects, mockTeachers } from '../utils/mockData';
import { Subject } from '../types';
import toast from 'react-hot-toast';

export const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    semester: 2,
    credits: 3,
    teacher_id: ''
  });

  const semesters = ['all', '2', '4', '6', '8'];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || subject.semester.toString() === selectedSemester;
    
    return matchesSearch && matchesSemester;
  });

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher?.name || 'Not Assigned';
  };

  const handleAddSubject = async () => {
    setLoading(true);
    try {
      const subjectData = {
        ...newSubject,
        id: Date.now().toString()
      };
      
      setSubjects(prev => [...prev, subjectData]);
      setShowAddModal(false);
      setNewSubject({
        name: '',
        code: '',
        semester: 2,
        credits: 3,
        teacher_id: ''
      });
      toast.success('Subject added successfully!');
    } catch (error) {
      toast.error('Failed to add subject');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    try {
      setSubjects(prev => 
        prev.map(s => s.id === selectedSubject.id ? selectedSubject : s)
      );
      
      setShowEditModal(false);
      setSelectedSubject(null);
      toast.success('Subject updated successfully!');
    } catch (error) {
      toast.error('Failed to update subject');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subject: Subject) => {
    if (!confirm(`Are you sure you want to delete ${subject.name}?`)) return;
    
    setLoading(true);
    try {
      setSubjects(prev => prev.filter(s => s.id !== subject.id));
      toast.success(`${subject.name} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete subject');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string, subject?: any) => {
    switch (action) {
      case 'add':
        setShowAddModal(true);
        break;
      case 'edit':
        if (subject) {
          setSelectedSubject(subject);
          setShowEditModal(true);
        }
        break;
      case 'delete':
        if (subject) handleDeleteSubject(subject);
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
            <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
            Subject Management
          </h1>
          <p className="text-gray-600 mt-2">Manage Computer Science Department subjects and curriculum</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAction('add')}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          {loading ? 'Adding...' : 'Add Subject'}
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            {semesters.map(sem => (
              <option key={sem} value={sem}>
                {sem === 'all' ? 'All Semesters' : `Semester ${sem}`}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSubjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction('edit', subject)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAction('delete', subject)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Semester
                </span>
                <span className="text-sm font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                  {subject.semester}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Credits
                </span>
                <span className="text-sm font-medium">{subject.credits}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Instructor
                </span>
                <span className="text-sm font-medium text-right">
                  {getTeacherName(subject.teacher_id)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Subject Code</span>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {subject.code}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Curriculum Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-4 bg-indigo-50 rounded-2xl mb-3 inline-block">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-indigo-600">{filteredSubjects.length}</p>
            <p className="text-sm text-gray-600">Total Subjects</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-green-50 rounded-2xl mb-3 inline-block">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {filteredSubjects.reduce((sum, s) => sum + s.credits, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Credits</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-purple-50 rounded-2xl mb-3 inline-block">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(filteredSubjects.map(s => s.teacher_id)).size}
            </p>
            <p className="text-sm text-gray-600">Active Faculty</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-blue-50 rounded-2xl mb-3 inline-block">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {new Set(filteredSubjects.map(s => s.semester)).size}
            </p>
            <p className="text-sm text-gray-600">Active Semesters</p>
          </div>
        </div>
      </motion.div>

      {/* Add Subject Modal */}
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Subject</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter subject name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter subject code"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <select
                      value={newSubject.semester}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, semester: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={2}>Semester 2</option>
                      <option value={4}>Semester 4</option>
                      <option value={6}>Semester 6</option>
                      <option value={8}>Semester 8</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                    <select
                      value={newSubject.credits}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, credits: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={2}>2 Credits</option>
                      <option value={3}>3 Credits</option>
                      <option value={4}>4 Credits</option>
                      <option value={5}>5 Credits</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Teacher</label>
                  <select
                    value={newSubject.teacher_id}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, teacher_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Teacher</option>
                    {mockTeachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.employee_id})
                      </option>
                    ))}
                  </select>
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
                  onClick={handleAddSubject}
                  disabled={loading || !newSubject.name || !newSubject.code || !newSubject.teacher_id}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Subject Modal */}
      <AnimatePresence>
        {showEditModal && selectedSubject && (
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Subject</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSubject(null);
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={selectedSubject.name}
                    onChange={(e) => setSelectedSubject(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={selectedSubject.code}
                    onChange={(e) => setSelectedSubject(prev => prev ? { ...prev, code: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                  <select
                    value={selectedSubject.credits}
                    onChange={(e) => setSelectedSubject(prev => prev ? { ...prev, credits: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                    <option value={5}>5 Credits</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Teacher</label>
                  <select
                    value={selectedSubject.teacher_id}
                    onChange={(e) => setSelectedSubject(prev => prev ? { ...prev, teacher_id: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {mockTeachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.employee_id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSubject(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubject}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Subject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};