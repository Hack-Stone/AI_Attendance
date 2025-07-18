import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Users, 
  Award,
  MapPin,
  Clock,
  GraduationCap,
  User,
  Star,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Student, Teacher } from '../types';
import { mockSubjects, mockStudents } from '../utils/mockData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Student | Teacher | null;
  type: 'student' | 'teacher';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, person, type }) => {
  if (!isOpen || !person) return null;

  const isStudent = type === 'student';
  const student = isStudent ? person as Student : null;
  const teacher = !isStudent ? person as Teacher : null;

  // Get additional data for students
  const getStudentSubjects = () => {
    if (!student) return [];
    return mockSubjects.filter(subject => subject.semester === student.semester);
  };

  // Get additional data for teachers
  const getTeacherStudents = () => {
    if (!teacher) return [];
    return mockStudents.filter(student => 
      teacher.semesters.includes(student.semester) && 
      teacher.sections.includes(student.section)
    );
  };

  const studentSubjects = isStudent ? getStudentSubjects() : [];
  const teacherStudents = !isStudent ? getTeacherStudents() : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-6">
              <img
                src={person.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                alt={person.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
              />
              <div>
                <h2 className="text-3xl font-bold mb-2">{person.name}</h2>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {isStudent ? student?.student_id : teacher?.employee_id}
                  </span>
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {person.email}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isStudent ? 'bg-green-500/20 text-green-100' : 'bg-purple-500/20 text-purple-100'
                  }`}>
                    {isStudent ? 'Student' : 'Faculty Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    {isStudent && student && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester:</span>
                          <span className="font-medium">{student.semester}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Section:</span>
                          <span className="font-medium">{student.section}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{student.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Department:</span>
                          <span className="font-medium">Computer Science</span>
                        </div>
                      </>
                    )}
                    
                    {!isStudent && teacher && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Employee ID:</span>
                          <span className="font-medium">{teacher.employee_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Department:</span>
                          <span className="font-medium">Computer Science</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Designation:</span>
                          <span className="font-medium">Assistant Professor</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">5+ Years</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{person.email}</span>
                    </div>
                    {isStudent && student && (
                      <>
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Parent/Guardian</p>
                          <div className="flex items-center space-x-3 mb-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{student.parent_email}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{student.parent_phone}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                {isStudent && student && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Attendance Overview
                    </h3>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {student.attendance_percentage}%
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Overall Attendance</p>
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
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{student.attended_classes} Present</span>
                        <span>{student.total_classes - student.attended_classes} Absent</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Detailed Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Subjects/Teaching Load */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                    {isStudent ? 'Enrolled Subjects' : 'Teaching Assignments'}
                  </h3>
                  
                  {isStudent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {studentSubjects.map((subject) => (
                        <div key={subject.id} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{subject.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Code: {subject.code}</p>
                            <p>Credits: {subject.credits}</p>
                            <p>Semester: {subject.semester}</p>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Attendance</span>
                              <span>{Math.round(75 + Math.random() * 20)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full" 
                                style={{ width: `${Math.round(75 + Math.random() * 20)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isStudent && teacher && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teacher.subjects.map((subject, index) => (
                          <div key={index} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h4 className="font-semibold text-indigo-900 mb-2">{subject}</h4>
                            <div className="space-y-1 text-sm text-indigo-700">
                              <p>Semesters: {teacher.semesters.join(', ')}</p>
                              <p>Sections: {teacher.sections.join(', ')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance/Students */}
                {!isStudent && teacher && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="h-6 w-6 mr-2 text-green-600" />
                      Students Under Guidance ({teacherStudents.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                      {teacherStudents.slice(0, 8).map((student) => (
                        <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.student_id}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              student.attendance_percentage >= 85 ? 'text-green-600' :
                              student.attendance_percentage >= 75 ? 'text-blue-600' :
                              'text-red-600'
                            }`}>
                              {student.attendance_percentage}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {teacherStudents.length > 8 && (
                      <p className="text-center text-gray-500 text-sm mt-4">
                        And {teacherStudents.length - 8} more students...
                      </p>
                    )}
                  </div>
                )}

                {/* Academic Performance for Students */}
                {isStudent && student && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="h-6 w-6 mr-2 text-yellow-600" />
                      Academic Performance
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {student.attended_classes}
                        </div>
                        <p className="text-sm text-green-700">Classes Attended</p>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {student.total_classes}
                        </div>
                        <p className="text-sm text-blue-700">Total Classes</p>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {studentSubjects.length}
                        </div>
                        <p className="text-sm text-purple-700">Subjects Enrolled</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Attendance Trend</h4>
                      <div className="space-y-2">
                        {['Excellent (90%+)', 'Good (75-89%)', 'Needs Improvement (<75%)'].map((category, index) => {
                          const isCurrentCategory = 
                            (student.attendance_percentage >= 90 && index === 0) ||
                            (student.attendance_percentage >= 75 && student.attendance_percentage < 90 && index === 1) ||
                            (student.attendance_percentage < 75 && index === 2);
                          
                          return (
                            <div key={category} className={`flex items-center justify-between p-2 rounded ${
                              isCurrentCategory ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                            }`}>
                              <span className="text-sm font-medium">{category}</span>
                              {isCurrentCategory && (
                                <Star className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Profile last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {isStudent ? 'Send Message to Student' : 'Contact Faculty'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};