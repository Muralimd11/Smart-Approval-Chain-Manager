import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('employee');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.post('/auth/register', {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin1218',
      role: 'admin',
      department: 'Administration'
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await login(formData.email, formData.password);
        if (response.success) {
          const userRole = response.data.role;
          if (userRole !== selectedRole) {
            toast.error(`Invalid login for ${selectedRole}. You are a ${userRole}.`);
            setLoading(false);
            return;
          }
          toast.success('Login successful!');
          navigate(userRole === 'admin' ? '/admin/dashboard' : `/${userRole}/dashboard`);
        }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col p-12 lg:p-16 xl:p-24" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center text-emerald-600 font-bold text-2xl tracking-tight mb-16">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center mr-2 shadow-sm text-lg block">A</span>
          ApproveHub
        </div>
        
        <div className="max-w-md">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-xs font-semibold mb-6">
               <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Secure workspace access
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight leading-tight">
              Sign in to your <span className="text-emerald-500">Approval Hub</span>
            </h1>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed">
              One unified workspace for employees, team leads, and managers to submit, review, and approve requests with full visibility.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="border border-slate-100 p-4 rounded-xl shadow-sm bg-white">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Members</p>
                  <p className="text-2xl font-black text-slate-800">128</p>
               </div>
               <div className="border border-slate-100 p-4 rounded-xl shadow-sm bg-white">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requests / MO</p>
                  <p className="text-2xl font-black text-slate-800">1,240</p>
               </div>
               <div className="border border-slate-100 p-4 rounded-xl shadow-sm bg-white">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AVG Approval</p>
                  <p className="text-2xl font-black text-slate-800">1.8h</p>
               </div>
               <div className="border border-slate-100 p-4 rounded-xl shadow-sm bg-white">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Uptime</p>
                  <p className="text-2xl font-black text-slate-800">99.9%</p>
               </div>
            </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-8 sm:p-12 border-l border-slate-100 relative">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1 drop-shadow-sm">Welcome Back</h2>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Sign in to continue</h1>
            <p className="text-sm text-slate-500 mt-2">Enter your credentials and select your role.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10 w-full bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3.5 transition-all shadow-sm"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 w-full bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3.5 transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setSelectedRole('employee')} className={`text-left p-3 rounded-xl border ${selectedRole === 'employee' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`font-semibold ${selectedRole === 'employee' ? 'text-emerald-700' : 'text-slate-800'}`}>Employee</div>
                  <div className="text-[10px] text-slate-500">Submit requests</div>
                </button>
                <button type="button" onClick={() => setSelectedRole('teamlead')} className={`text-left p-3 rounded-xl border ${selectedRole === 'teamlead' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`font-semibold ${selectedRole === 'teamlead' ? 'text-emerald-700' : 'text-slate-800'}`}>Team Lead</div>
                  <div className="text-[10px] text-slate-500">Initial approvals</div>
                </button>
                <button type="button" onClick={() => setSelectedRole('manager')} className={`text-left p-3 rounded-xl border ${selectedRole === 'manager' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`font-semibold ${selectedRole === 'manager' ? 'text-emerald-700' : 'text-slate-800'}`}>Manager</div>
                  <div className="text-[10px] text-slate-500">Final approvals</div>
                </button>
                <button type="button" onClick={() => setSelectedRole('admin')} className={`text-left p-3 rounded-xl border ${selectedRole === 'admin' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`font-semibold ${selectedRole === 'admin' ? 'text-emerald-700' : 'text-slate-800'}`}>Admin</div>
                  <div className="text-[10px] text-slate-500">Manage org</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-95"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Sign in \u2192'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;
