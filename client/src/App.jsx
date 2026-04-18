import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

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
import UserDirectory from './pages/UserDirectory';
import ResetSignaturePin from './pages/ResetSignaturePin';
import Activities from './pages/Activities';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
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

              <Route
                path="/users"
                element={
                  <PrivateRoute>
                    <UserDirectory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <PrivateRoute>
                    <Activities />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/reset-signature-pin/:token" element={<ResetSignaturePin />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </NotificationProvider>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
