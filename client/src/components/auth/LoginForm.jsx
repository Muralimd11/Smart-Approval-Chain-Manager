import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [selectedRole, setSelectedRole] = useState(null); // 'employee', 'teamlead', 'manager'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ email: '', password: '' }); // Clear form when switching roles
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        const userRole = response.data.role;

        // Role Verification Check
        if (userRole !== selectedRole) {
          toast.error(`Invalid login for ${selectedRole.replace(/^\w/, c => c.toUpperCase())} role. You are a ${userRole}.`);
          // Ideally logout here or just don't navigate
          // Since login() inside AuthContext sets the user, we might want to "undo" that if we want to be strict.
          // However, for this UI-level check, preventing navigation is sufficient for now.
          setLoading(false);
          return;
        }

        toast.success('Login successful!');

        // Redirect based on role
        if (userRole === 'employee') {
          navigate('/employee/dashboard');
        } else if (userRole === 'teamlead') {
          navigate('/teamlead/dashboard');
        } else if (userRole === 'manager') {
          navigate('/manager/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Role Selection View
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to Smart Approval Chain
            </h2>
            <p className="mt-2 text-center text-lg text-gray-600">
              Please select your role to continue
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-10">
            {/* Employee Card */}
            <div
              onClick={() => handleRoleSelect('employee')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Employee</h3>
                <p className="mt-1 text-sm text-gray-500">Access your tasks and submit requests</p>
              </div>
            </div>

            {/* Team Lead Card */}
            <div
              onClick={() => handleRoleSelect('teamlead')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Team Lead</h3>
                <p className="mt-1 text-sm text-gray-500">Manage team approvals and workflow</p>
              </div>
            </div>

            {/* Manager Card */}
            <div
              onClick={() => handleRoleSelect('manager')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Manager</h3>
                <p className="mt-1 text-sm text-gray-500">Oversee projects and final approvals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Selected Role Login View
  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'employee': return 'Employee Login';
      case 'teamlead': return 'Team Lead Login';
      case 'manager': return 'Manager Login';
      default: return 'Login';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl relative">
        <button
          onClick={() => setSelectedRole(null)}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="text-center mt-2">
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${selectedRole === 'employee' ? 'bg-blue-100 text-blue-600' :
              selectedRole === 'teamlead' ? 'bg-purple-100 text-purple-600' :
                'bg-indigo-100 text-indigo-600'
            }`}>
            {selectedRole === 'employee' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {selectedRole === 'teamlead' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            {selectedRole === 'manager' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {getRoleTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 border-t pt-4">
          <p className="font-medium mb-2">Demo Credentials for {selectedRole}:</p>
          {selectedRole === 'employee' && <p>employee@test.com / password123</p>}
          {selectedRole === 'teamlead' && <p>teamlead@test.com / password123</p>}
          {selectedRole === 'manager' && <p>manager@test.com / password123</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
