import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';

// Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import TeamLeadDashboard from './pages/TeamLeadDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              
              <Route
                path="/employee/dashboard"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute allowedRoles={['employee']}>
                      <EmployeeDashboard />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/teamlead/dashboard"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute allowedRoles={['teamlead']}>
                      <TeamLeadDashboard />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/manager/dashboard"
                element={
                  <PrivateRoute>
                    <RoleBasedRoute allowedRoles={['manager']}>
                      <ManagerDashboard />
                    </RoleBasedRoute>
                  </PrivateRoute>
                }
              />
              
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
