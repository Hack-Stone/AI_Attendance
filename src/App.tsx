import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { Subjects } from './components/Subjects';
import { Attendance } from './components/Attendance';
import { Defaulters } from './components/Defaulters';
import { FacultyManagement } from './components/FacultyManagement';
import { Reports } from './components/Reports';
import { SystemSettings } from './components/SystemSettings';
import { NotificationCenter } from './components/NotificationCenter';
import { LeaveApplication } from './components/LeaveApplication';
import { PersonalAttendance } from './components/PersonalAttendance';
import { getCurrentUser } from './utils/auth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/defaulters" element={<Defaulters />} />
                  <Route path="/my-attendance" element={<PersonalAttendance />} />
                  <Route path="/my-subjects" element={<Subjects />} />
                  <Route path="/leave-application" element={<LeaveApplication />} />
                  <Route path="/teachers" element={<FacultyManagement />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/notifications" element={<NotificationCenter />} />
                  <Route path="/settings" element={<SystemSettings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;