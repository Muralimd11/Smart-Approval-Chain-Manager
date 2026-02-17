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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl"></div>
        </div>

        <div className="max-w-5xl w-full space-y-8 relative z-10">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
              Smart Approval Chain
            </h2>
            <p className="mt-3 text-center text-lg text-gray-500 max-w-2xl mx-auto">
              Streamline your workflow with our intelligent approval management system. select your role to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-12">
            {/* Employee Card */}
            <div
              onClick={() => handleRoleSelect('employee')}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Employee</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Submit requests for leave, purchases, and expenses seamlessly.</p>
              </div>
              <div className="bg-blue-50 py-3 text-center text-xs font-semibold text-blue-600 uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Login
              </div>
            </div>

            {/* Team Lead Card */}
            <div
              onClick={() => handleRoleSelect('teamlead')}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-purple-50 text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Team Lead</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Review and approve initial requests from your team members.</p>
              </div>
              <div className="bg-purple-50 py-3 text-center text-xs font-semibold text-purple-600 uppercase tracking-widest group-hover:bg-purple-600 group-hover:text-white transition-colors">
                Login
              </div>
            </div>

            {/* Manager Card */}
            <div
              onClick={() => handleRoleSelect('manager')}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-50 text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Manager</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Finalize approvals and oversee the entire project lifecycle.</p>
              </div>
              <div className="bg-indigo-50 py-3 text-center text-xs font-semibold text-indigo-600 uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Login
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Selected Role Login View
  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'employee': return { color: 'blue', title: 'Employee Portal' };
      case 'teamlead': return { color: 'purple', title: 'Team Lead Portal' };
      case 'manager': return { color: 'indigo', title: 'Manager Portal' };
      default: return { color: 'gray', title: 'Login' };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-${theme.color}-200/30 blur-3xl transition-colors duration-500`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-${theme.color}-200/30 blur-3xl transition-colors duration-500`}></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl relative z-10 border border-gray-100">
        <button
          onClick={() => setSelectedRole(null)}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors flex items-center text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="text-center mt-6">
          <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 bg-${theme.color}-50 text-${theme.color}-600 transition-colors duration-500`}>
            {selectedRole === 'employee' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {selectedRole === 'teamlead' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            {selectedRole === 'manager' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {theme.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-gray-50 focus:bg-white"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-${theme.color}-600 hover:bg-${theme.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme.color}-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          <p className="font-medium mb-2 uppercase tracking-wide">Demo Credentials</p>
          <div className="inline-block bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            {selectedRole === 'employee' && <p className="font-mono text-gray-600">employee@test.com / password123</p>}
            {selectedRole === 'teamlead' && <p className="font-mono text-gray-600">teamlead@test.com / password123</p>}
            {selectedRole === 'manager' && <p className="font-mono text-gray-600">manager@test.com / password123</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
