import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ email: '', password: '' });
  };

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
        navigate(`/${userRole}/dashboard`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-indigo-50/50 via-[#f4f7fb] to-blue-50/50 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
        <div className="absolute top-8 right-8 z-50">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700 transition-colors">
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 dark:bg-indigo-600/10 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 dark:bg-blue-600/10 blur-[100px] animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-6xl w-full mx-auto space-y-12 relative z-10 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 drop-shadow-sm">
              Smart Approval <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Chain</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Enterprise-grade approval management. Select your role to begin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {/* Employee */}
            <div onClick={() => handleRoleSelect('employee')} className="glass-card rounded-2xl cursor-pointer group flex flex-col items-center p-10 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Employee</h3>
              <p className="text-center text-slate-500 dark:text-slate-400 leading-relaxed mb-6">Submit requests for leave, purchases, and expenses seamlessly.</p>
              <div className="mt-auto px-6 py-2 rounded-full font-bold text-sm bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">Login</div>
            </div>

            {/* Team Lead */}
            <div onClick={() => handleRoleSelect('teamlead')} className="glass-card rounded-2xl cursor-pointer group flex flex-col items-center p-10 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-500/20 dark:to-purple-600/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Team Lead</h3>
              <p className="text-center text-slate-500 dark:text-slate-400 leading-relaxed mb-6">Review and approve initial requests from your team members.</p>
              <div className="mt-auto px-6 py-2 rounded-full font-bold text-sm bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">Login</div>
            </div>

            {/* Manager */}
            <div onClick={() => handleRoleSelect('manager')} className="glass-card rounded-2xl cursor-pointer group flex flex-col items-center p-10 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-500/20 dark:to-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Manager</h3>
              <p className="text-center text-slate-500 dark:text-slate-400 leading-relaxed mb-6">Finalize approvals and oversee the entire project lifecycle.</p>
              <div className="mt-auto px-6 py-2 rounded-full font-bold text-sm bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">Login</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'employee': return { title: 'Employee Portal', grad: 'from-blue-600 to-cyan-500', rings: 'bg-blue-500/20' };
      case 'teamlead': return { title: 'Team Lead Portal', grad: 'from-purple-600 to-pink-500', rings: 'bg-purple-500/20' };
      case 'manager': return { title: 'Manager Portal', grad: 'from-indigo-600 to-blue-600', rings: 'bg-indigo-500/20' };
      default: return { title: 'Login', grad: 'from-slate-600 to-slate-500', rings: 'bg-slate-500/20' };
    }
  };
  const theme = getRoleTheme();

  return (
    <div className="min-h-screen flex text-slate-900 dark:text-white">
      {/* Left Panel - Hero Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.grad} opacity-90`}></div>
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-lg px-8 animate-fade-in-up">
          <h1 className="text-5xl font-black text-white mb-6 drop-shadow-md tracking-tight">Welcome to <br />{theme.title}</h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed">
            Access your secure dashboard to manage requests, track approvals, and streamline your workflow with zero friction.
          </p>
          <div className="mt-12 flex items-center space-x-6">
            <div className="flex -space-x-4">
              {['11', '32', '44'].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="Professional" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <p className="text-sm font-semibold text-white/90">Join 10,000+ professionals</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-20 xl:px-28 bg-[#f4f7fb] dark:bg-slate-900 relative h-screen overflow-y-auto">
        <div className="py-6 sm:py-8 flex justify-between items-center z-20 shrink-0">
          <button onClick={() => setSelectedRole(null)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center font-bold text-sm transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to Roles
          </button>
          
          <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700 transition-colors">
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto animate-fade-in pb-12">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">Sign In</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Enter your credentials to access the {theme.title.toLowerCase()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Work Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} 
                className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="name@company.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} 
                className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="••••••••" 
              />
            </div>

            <button type="submit" disabled={loading} 
              className={`w-full py-4 px-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r ${theme.grad} hover:shadow-lg hover:-translate-y-0.5 transform transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mt-4`}
            >
              {loading ? 'Authenticating...' : 'Secure Sign In'}
            </button>
          </form>

          <div className="mt-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Demo Access</p>
            <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
              {selectedRole}@test.com<br/>
              <span className="text-slate-500 dark:text-slate-400 text-xs mt-1 block">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
