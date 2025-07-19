import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, AlertTriangle, Info, CheckCircle, Clock, User, Calendar, Filter, AreaChart as MarkAsUnread, Trash2, Settings } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { mockStudents } from '../utils/mockData';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'leave_request';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  studentId?: string;
  leaveId?: string;
}

export const NotificationCenter: React.FC = () => {
  const user = getCurrentUser();
  const [filter, setFilter] = useState<'all' | 'unread' | 'leave_requests'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'leave_request',
      title: 'Leave Request - Arjun Patel',
      message: 'Medical leave request for 3 days (Jan 15-17, 2024). Reason: Fever and flu symptoms.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionRequired: true,
      studentId: '1',
      leaveId: 'LV001'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Attendance Alert',
      message: 'Rahul Singh attendance has dropped to 65%. Immediate attention required.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionRequired: false
    },
    {
      id: '3',
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2 AM - 4 AM. System will be temporarily unavailable.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      read: true,
      actionRequired: false
    },
    {
      id: '4',
      type: 'success',
      title: 'Attendance Report Generated',
      message: 'Monthly attendance report for December 2024 has been generated successfully.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      actionRequired: false
    },
    {
      id: '5',
      type: 'leave_request',
      title: 'Leave Request - Sneha Reddy',
      message: 'Personal leave request for 1 day (Jan 20, 2024). Reason: Family function.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionRequired: true,
      studentId: '2',
      leaveId: 'LV002'
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'leave_requests') return notification.type === 'leave_request';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const leaveRequestCount = notifications.filter(n => n.type === 'leave_request' && !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      case 'leave_request':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? '50' : '100';
    switch (type) {
      case 'success':
        return `bg-green-${opacity}`;
      case 'warning':
        return `bg-amber-${opacity}`;
      case 'error':
        return `bg-red-${opacity}`;
      case 'leave_request':
        return `bg-blue-${opacity}`;
      default:
        return `bg-blue-${opacity}`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleLeaveAction = (leaveId: string, action: 'approve' | 'reject') => {
    // Update notification
    setNotifications(prev => 
      prev.map(n => 
        n.leaveId === leaveId 
          ? { ...n, read: true, actionRequired: false, title: `${n.title} - ${action === 'approve' ? 'Approved' : 'Rejected'}` }
          : n
      )
    );
    
    toast.success(`Leave request ${action}d successfully`);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="h-8 w-8 text-blue-600 mr-3" />
            Notification Center
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'teacher' 
              ? 'Manage department notifications and leave requests' 
              : 'View your notifications and alerts'}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <MarkAsUnread className="h-4 w-4 mr-2" />
            Mark All Read
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-3xl font-bold text-blue-600">{notifications.length}</p>
            </div>
            <Bell className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-amber-600">{unreadCount}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Leave Requests</p>
              <p className="text-3xl font-bold text-green-600">{leaveRequestCount}</p>
            </div>
            <Calendar className="h-12 w-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Notifications' },
              { key: 'unread', label: 'Unread' },
              { key: 'leave_requests', label: 'Leave Requests' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-semibold text-gray-900">
            {filter === 'all' ? 'All Notifications' : 
             filter === 'unread' ? 'Unread Notifications' : 'Leave Requests'}
          </h3>
          <p className="text-sm text-gray-600">{filteredNotifications.length} notifications</p>
        </div>
        
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`px-6 py-4 hover:bg-gray-50 transition-all duration-200 ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getNotificationBg(notification.type, notification.read)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                        {notification.actionRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Action Required
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {notification.type === 'leave_request' && notification.actionRequired && user?.role === 'teacher' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLeaveAction(notification.leaveId!, 'approve')}
                          className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-all"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLeaveAction(notification.leaveId!, 'reject')}
                          className="flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-all"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </motion.button>
                      </>
                    )}
                    
                    {!notification.read && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Check className="h-4 w-4" />
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'All caught up! No unread notifications.' : 
               filter === 'leave_requests' ? 'No pending leave requests.' : 
               'You have no notifications at this time.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};