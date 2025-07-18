import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Mail, 
  Phone, 
  Download, 
  Filter,
  TrendingDown,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { mockStudents } from '../utils/mockData';

export const Defaulters: React.FC = () => {
  const [threshold, setThreshold] = useState(75);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');

  const classes = ['all', '10th', '11th', '12th'];
  const sections = ['all', 'A', 'B', 'C'];

  const defaulters = mockStudents.filter(student => {
    const meetsCriteria = student.attendancePercentage < threshold;
    const matchesSemester = selectedClass === 'all' || student.semester.toString() === selectedClass;
    const matchesSection = selectedSection === 'all' || student.section === selectedSection;
    
    return meetsCriteria && matchesSemester && matchesSection;
  }).sort((a, b) => a.attendance_percentage - b.attendance_percentage);

  const getSeverityLevel = (percentage: number) => {
    if (percentage < 50) return { level: 'Critical', color: 'text-red-700 bg-red-100 border-red-200' };
    if (percentage < 65) return { level: 'High', color: 'text-orange-700 bg-orange-100 border-orange-200' };
    return { level: 'Medium', color: 'text-amber-700 bg-amber-100 border-amber-200' };
  };

  const handleSendAlert = (studentId: string, type: 'email' | 'sms') => {
    // Simulate sending alert
    console.log(`Sending ${type} alert to student ${studentId}`);
  };

  const handleBulkAlert = (type: 'email' | 'sms') => {
    // Simulate bulk alert
    console.log(`Sending bulk ${type} alerts to ${defaulters.length} students`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            Attendance Defaulters
          </h1>
          <p className="text-gray-600 mt-1">Students requiring immediate attention</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => handleBulkAlert('email')}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email All
          </button>
          <button
            onClick={() => handleBulkAlert('sms')}
            className="flex items-center px-4 py-2 text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS All
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Defaulters</p>
              <p className="text-2xl font-bold text-red-600">{defaulters.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical (&lt;50%)</p>
              <p className="text-2xl font-bold text-red-700">
                {defaulters.filter(s => s.attendance_percentage < 50).length}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-700" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk (50-65%)</p>
              <p className="text-2xl font-bold text-orange-600">
                {defaulters.filter(s => s.attendance_percentage >= 50 && s.attendance_percentage < 65).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Risk (65-75%)</p>
              <p className="text-2xl font-bold text-amber-600">
                {defaulters.filter(s => s.attendance_percentage >= 65 && s.attendance_percentage < 75).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Threshold
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="50"
                max="90"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12">{threshold}%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {['all', '2', '4', '6', '8'].map(sem => (
                <option key={sem} value={sem}>
                  {sem === 'all' ? 'All Semesters' : `Semester ${sem}`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sections.map(section => (
                <option key={section} value={section}>
                  {section === 'all' ? 'All Sections' : `Section ${section}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Defaulters List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Students Below {threshold}% Attendance
          </h3>
          <p className="text-sm text-gray-600">
            {defaulters.length} students need immediate attention
          </p>
        </div>
        
        {defaulters.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Great News!</h3>
            <p className="text-gray-600">
              No students below {threshold}% attendance threshold
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {defaulters.map((student) => {
              const severity = getSeverityLevel(student.attendance_percentage);
              
              return (
                <div key={student.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          {student.student_id} • Semester {student.semester} - Section {student.section}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            📧 {student.parent_email}
                          </span>
                          <span className="text-xs text-gray-500">
                            📱 {student.parent_phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${severity.color}`}>
                          {severity.level}
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                          {student.attendance_percentage}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.attended_classes}/{student.total_classes} classes
                        </p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleSendAlert(student.id, 'email')}
                          className="flex items-center px-3 py-1.5 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </button>
                        <button
                          onClick={() => handleSendAlert(student.id, 'sms')}
                          className="flex items-center px-3 py-1.5 text-xs text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          SMS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Panel */}
      {defaulters.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Immediate Action Required
              </h3>
              <p className="text-red-700 mb-4">
                {defaulters.length} students have attendance below the required threshold. 
                Consider implementing intervention strategies:
              </p>
              <ul className="text-sm text-red-700 space-y-1 mb-4">
                <li>• Contact parents/guardians immediately</li>
                <li>• Schedule counseling sessions</li>
                <li>• Implement attendance monitoring plans</li>
                <li>• Consider academic support programs</li>
              </ul>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Generate Intervention Report
                </button>
                <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};