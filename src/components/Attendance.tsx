import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  QrCode,
  Upload,
  Download,
  Save,
  Filter,
  Camera,
  FileText,
  X
} from 'lucide-react';
import { mockStudents, mockSubjects } from '../utils/mockData';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('6');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [bulkAction, setBulkAction] = useState<'present' | 'absent' | ''>('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const semesters = ['2', '4', '6', '8'];
  const sections = ['A', 'B'];

  // Get subjects for selected semester
  const availableSubjects = mockSubjects.filter(subject => 
    subject.semester === parseInt(selectedSemester)
  );

  // Get students for selected semester and section
  const filteredStudents = mockStudents.filter(
    student => student.semester === parseInt(selectedSemester) && student.section === selectedSection
  );

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleBulkAction = () => {
    if (!bulkAction) return;
    
    const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = bulkAction;
    });
    setAttendance(newAttendance);
    setBulkAction('');
    toast.success(`Marked all students as ${bulkAction}`);
  };

  const handleSaveAttendance = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    if (Object.keys(attendance).length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const attendanceData = {
        date: selectedDate,
        subject: selectedSubject,
        semester: selectedSemester,
        section: selectedSection,
        attendance: attendance,
        totalStudents: filteredStudents.length,
        markedStudents: Object.keys(attendance).length
      };

      console.log('Saving attendance:', attendanceData);
      toast.success(`Attendance saved successfully for ${Object.keys(attendance).length} students`);
      
      // Reset attendance after saving
      setAttendance({});
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
    // Simulate QR scanning
    setTimeout(() => {
      const randomStudents = filteredStudents.slice(0, Math.floor(Math.random() * filteredStudents.length) + 1);
      const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
      
      randomStudents.forEach(student => {
        newAttendance[student.id] = 'present';
      });
      
      setAttendance(prev => ({ ...prev, ...newAttendance }));
      setShowQRScanner(false);
      toast.success(`QR scan completed! Marked ${randomStudents.length} students present`);
    }, 2000);
  };

  const handleImportAttendance = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setLoading(true);
        toast.success(`Importing attendance from ${file.name}...`);
        
        // Simulate import process
        setTimeout(() => {
          const importedAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
          filteredStudents.forEach(student => {
            importedAttendance[student.id] = Math.random() > 0.3 ? 'present' : 'absent';
          });
          
          setAttendance(importedAttendance);
          setLoading(false);
          toast.success('Attendance imported successfully!');
        }, 2000);
      }
    };
    input.click();
  };

  const handleExportAttendance = () => {
    const csvContent = [
      ['Student ID', 'Name', 'Semester', 'Section', 'Status'],
      ...filteredStudents.map(student => [
        student.student_id,
        student.name,
        student.semester,
        student.section,
        attendance[student.id] || 'Not Marked'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}_${selectedSubject.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Attendance exported successfully!');
  };

  const getStatusColor = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return 'bg-green-500 hover:bg-green-600';
      case 'absent':
        return 'bg-red-500 hover:bg-red-600';
      case 'late':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-gray-300 hover:bg-gray-400';
    }
  };

  const presentCount = Object.values(attendance).filter(status => status === 'present').length;
  const absentCount = Object.values(attendance).filter(status => status === 'absent').length;
  const lateCount = Object.values(attendance).filter(status => status === 'late').length;
  const unmarkedCount = filteredStudents.length - Object.keys(attendance).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            Mark Attendance
          </h1>
          <p className="text-gray-600 mt-2">Record student attendance efficiently for CS Department</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQRScan}
            disabled={loading}
            className="flex items-center px-4 py-2 text-purple-600 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all shadow-sm"
          >
            <QrCode className="h-4 w-4 mr-2" />
            {loading ? 'Scanning...' : 'QR Scan'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportAttendance}
            disabled={loading}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            {loading ? 'Importing...' : 'Import'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportAttendance}
            disabled={loading || Object.keys(attendance).length === 0}
            className="flex items-center px-4 py-2 text-green-600 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all shadow-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveAttendance}
            disabled={loading || Object.keys(attendance).length === 0}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save'}
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedSubject(''); // Reset subject when semester changes
                setAttendance({}); // Reset attendance
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {semesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setAttendance({}); // Reset attendance
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setAttendance({}); // Reset attendance when subject changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Subject</option>
              {availableSubjects.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Action</label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as 'present' | 'absent' | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Action</option>
              <option value="present">Mark All Present</option>
              <option value="absent">Mark All Absent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apply</label>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || filteredStudents.length === 0}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unmarked</p>
              <p className="text-2xl font-bold text-gray-600">{unmarkedCount}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Student List */}
      {selectedSubject ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-semibold text-gray-900">
              Semester {selectedSemester} - Section {selectedSection} | {selectedSubject}
            </h3>
            <p className="text-sm text-gray-600">{format(new Date(selectedDate), 'PPPP')}</p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => {
              const status = attendance[student.id];
              
              return (
                <motion.div 
                  key={student.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          {student.student_id} • Semester {student.semester} - Section {student.section}
                        </p>
                        <p className="text-xs text-gray-500">
                          Current Attendance: {student.attendance_percentage}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={`flex items-center px-4 py-2 rounded-xl text-white text-sm font-medium transition-all shadow-sm ${
                          status === 'present' ? 'bg-green-600 shadow-green-200' : 'bg-gray-300 hover:bg-green-500'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Present
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAttendanceChange(student.id, 'late')}
                        className={`flex items-center px-4 py-2 rounded-xl text-white text-sm font-medium transition-all shadow-sm ${
                          status === 'late' ? 'bg-amber-600 shadow-amber-200' : 'bg-gray-300 hover:bg-amber-500'
                        }`}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Late
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={`flex items-center px-4 py-2 rounded-xl text-white text-sm font-medium transition-all shadow-sm ${
                          status === 'absent' ? 'bg-red-600 shadow-red-200' : 'bg-gray-300 hover:bg-red-500'
                        }`}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Absent
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Subject to Continue</h3>
          <p className="text-gray-600">
            Please select a subject from the dropdown above to start marking attendance for Semester {selectedSemester} - Section {selectedSection}
          </p>
        </div>
      )}

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
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
              className="bg-white rounded-2xl p-8 w-full max-w-md text-center"
            >
              <div className="mb-6">
                <div className="p-4 bg-purple-100 rounded-full inline-block mb-4">
                  <Camera className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Scanner</h3>
                <p className="text-gray-600">Scanning for student QR codes...</p>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
              
              <button
                onClick={() => setShowQRScanner(false)}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};