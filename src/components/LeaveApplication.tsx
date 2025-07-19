import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  User,
  Send,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'medical' | 'personal' | 'emergency' | 'family';
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  comments?: string;
  documents?: string[];
}

export const LeaveApplication: React.FC = () => {
  const user = getCurrentUser();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'LV001',
      studentId: user?.student_id || 'CS2021001',
      studentName: user?.name || 'Current Student',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      reason: 'Medical leave due to fever and flu symptoms. Doctor advised rest for 3 days.',
      type: 'medical',
      status: 'pending',
      appliedDate: '2024-01-12',
      documents: ['medical_certificate.pdf']
    },
    {
      id: 'LV002',
      studentId: user?.student_id || 'CS2021001',
      studentName: user?.name || 'Current Student',
      startDate: '2024-01-05',
      endDate: '2024-01-05',
      reason: 'Family wedding ceremony',
      type: 'family',
      status: 'approved',
      appliedDate: '2024-01-02',
      approvedBy: 'Dr. Rajesh Kumar',
      comments: 'Approved. Please submit attendance makeup work.'
    },
    {
      id: 'LV003',
      studentId: user?.student_id || 'CS2021001',
      studentName: user?.name || 'Current Student',
      startDate: '2023-12-20',
      endDate: '2023-12-22',
      reason: 'Personal work',
      type: 'personal',
      status: 'rejected',
      appliedDate: '2023-12-18',
      approvedBy: 'Dr. Rajesh Kumar',
      comments: 'Insufficient reason provided. Please reapply with proper justification.'
    }
  ]);

  const [newLeave, setNewLeave] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'personal' as 'medical' | 'personal' | 'emergency' | 'family'
  });

  const handleSubmitLeave = async () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    const leaveRequest: LeaveRequest = {
      id: `LV${String(Date.now()).slice(-3)}`,
      studentId: user?.student_id || 'CS2021001',
      studentName: user?.name || 'Current Student',
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      reason: newLeave.reason,
      type: newLeave.type,
      status: 'pending',
      appliedDate: format(new Date(), 'yyyy-MM-dd')
    };

    setLeaveRequests(prev => [leaveRequest, ...prev]);
    setShowApplicationForm(false);
    setNewLeave({
      startDate: '',
      endDate: '',
      reason: '',
      type: 'personal'
    });
    
    toast.success('Leave application submitted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'rejected':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-amber-700 bg-amber-100 border-amber-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'emergency':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'family':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const pendingCount = leaveRequests.filter(req => req.status === 'pending').length;
  const approvedCount = leaveRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = leaveRequests.filter(req => req.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            Leave Applications
          </h1>
          <p className="text-gray-600 mt-2">Manage your leave requests and track approval status</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowApplicationForm(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Apply for Leave
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-blue-600">{leaveRequests.length}</p>
            </div>
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <Clock className="h-12 w-12 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-semibold text-gray-900">Your Leave Applications</h3>
          <p className="text-sm text-gray-600">{leaveRequests.length} applications submitted</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {leaveRequests.map((leave) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-4 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">Leave Request #{leave.id}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                      {getStatusIcon(leave.status)}
                      <span className="ml-1 capitalize">{leave.status}</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(leave.type)}`}>
                      {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p>{format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-gray-500">{calculateDays(leave.startDate, leave.endDate)} day(s)</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Applied:</span>
                      <p>{format(new Date(leave.appliedDate), 'MMM dd, yyyy')}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Reason:</span>
                      <p className="truncate">{leave.reason}</p>
                    </div>
                  </div>
                  
                  {leave.comments && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs font-medium text-gray-700">Comments:</span>
                      <p className="text-sm text-gray-600">{leave.comments}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedLeave(leave);
                      setShowDetails(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  
                  {leave.status === 'pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {leaveRequests.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No leave applications</h3>
            <p className="text-gray-600">You haven't submitted any leave applications yet.</p>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && (
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
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Apply for Leave</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  <select
                    value={newLeave.type}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="personal">Personal</option>
                    <option value="medical">Medical</option>
                    <option value="family">Family</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                      min={newLeave.startDate || format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave</label>
                  <textarea
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                    rows={4}
                    placeholder="Please provide a detailed reason for your leave request..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents (Optional)</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload medical certificates, official documents, etc.</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitLeave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && selectedLeave && (
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
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Leave Request Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Application ID:</span>
                    <p className="text-gray-900">{selectedLeave.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedLeave.status)} ml-2`}>
                      {getStatusIcon(selectedLeave.status)}
                      <span className="ml-1 capitalize">{selectedLeave.status}</span>
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Leave Type:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(selectedLeave.type)} ml-2`}>
                    {selectedLeave.type.charAt(0).toUpperCase() + selectedLeave.type.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Start Date:</span>
                    <p className="text-gray-900">{format(new Date(selectedLeave.startDate), 'PPPP')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">End Date:</span>
                    <p className="text-gray-900">{format(new Date(selectedLeave.endDate), 'PPPP')}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Duration:</span>
                  <p className="text-gray-900">{calculateDays(selectedLeave.startDate, selectedLeave.endDate)} day(s)</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Reason:</span>
                  <p className="text-gray-900 mt-1">{selectedLeave.reason}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Applied Date:</span>
                  <p className="text-gray-900">{format(new Date(selectedLeave.appliedDate), 'PPPP')}</p>
                </div>
                
                {selectedLeave.approvedBy && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Approved/Rejected By:</span>
                    <p className="text-gray-900">{selectedLeave.approvedBy}</p>
                  </div>
                )}
                
                {selectedLeave.comments && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Comments:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{selectedLeave.comments}</p>
                    </div>
                  </div>
                )}
                
                {selectedLeave.documents && selectedLeave.documents.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Documents:</span>
                    <div className="mt-1 space-y-1">
                      {selectedLeave.documents.map((doc, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};