import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  Settings,
  Menu,
  X,
  LogOut,
  MessageCircle,
  User,
  BookOpen,
  GraduationCap,
  Monitor,
  Bell
} from 'lucide-react';
import { getCurrentUser, logout } from '../utils/auth';
import { ChatBot } from './ChatBot';
import toast, { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: BarChart3, label: 'Dashboard', color: 'text-blue-600' },
    ];

    if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { path: '/students', icon: Users, label: 'Student Management', color: 'text-green-600' },
        { path: '/teachers', icon: GraduationCap, label: 'Faculty Management', color: 'text-purple-600' },
        { path: '/subjects', icon: BookOpen, label: 'Subject Management', color: 'text-indigo-600' },
        { path: '/attendance', icon: Calendar, label: 'Mark Attendance', color: 'text-orange-600' },
        { path: '/defaulters', icon: AlertTriangle, label: 'Defaulters', color: 'text-red-600' },
        { path: '/reports', icon: FileText, label: 'Reports & Analytics', color: 'text-teal-600' },
        { path: '/notifications', icon: Bell, label: 'Notifications', color: 'text-pink-600' },
        { path: '/settings', icon: Settings, label: 'System Settings', color: 'text-gray-600' },
      ];
    } else {
      return [
        ...baseItems,
        { path: '/my-attendance', icon: Calendar, label: 'My Attendance', color: 'text-blue-600' },
        { path: '/my-subjects', icon: BookOpen, label: 'My Subjects', color: 'text-green-600' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CS Department
                </h1>
                <p className="text-xs text-gray-500">Attendance System</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-6 lg:mt-8 px-3 lg:px-4 space-y-1 lg:space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : item.color}`} />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                alt={user?.name}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role} • {user?.employee_id || user?.student_id}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-64 xl:ml-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                  Computer Science Department
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                  Smart Attendance Management System
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChatOpen(true)}
                className="relative p-2 lg:p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};