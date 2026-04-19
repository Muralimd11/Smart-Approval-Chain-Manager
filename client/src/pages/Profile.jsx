import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
    const { user } = useAuth();
    const [teamLeads, setTeamLeads] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [updatingParams, setUpdatingParams] = useState(false);

    useEffect(() => {
        const fetchHierarchy = async () => {
            try {
                const response = await authService.getAllUsers();
                if (response.success || response.data) {
                    const allUsers = response.data || response;
                    
                    // Same department filter
                    const myDeptUsers = allUsers.filter(u => u.department === user.department);
                    
                    if (user.role === 'employee' || user.role === 'teamlead') {
                        setTeamLeads(myDeptUsers.filter(u => u.role === 'teamlead'));
                        setManagers(myDeptUsers.filter(u => u.role === 'manager'));
                    } else if (user.role === 'manager') {
                        // Manager might want to see who reports to them
                        setTeamLeads(myDeptUsers.filter(u => u.role === 'teamlead'));
                    }
                }
            } catch (err) {
                console.error("Failed to load hierarchy", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHierarchy();
    }, [user]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setUpdatingParams(true);
        try {
            await authService.updatePassword(passwordData);
            import('react-hot-toast').then(({ default: toast }) => toast.success('Password updated securely!'));
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            import('react-hot-toast').then(({ default: toast }) => toast.error(error.response?.data?.message || 'Failed to update password'));
        } finally {
            setUpdatingParams(false);
        }
    };

    const ProfileCard = ({ title, person, iconColor = "blue" }) => {
        const colorMap = {
            blue: { bg: 'bg-blue-50 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
            amber: { bg: 'bg-amber-50 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
            indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400' }
        };
        const colors = colorMap[iconColor] || colorMap.blue;
        
        return (
        <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-xl hover:bg-white transition-colors">
            {person ? (
                <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} font-bold shadow-sm`}>
                        {person.name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{person.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{person.email}</p>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-gray-400 dark:text-slate-500 italic flex items-center">
                    <svg className="w-5 h-5 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    No {title.toLowerCase()} assigned.
                </div>
            )}
            <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
            </div>
        </div>
    );
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8">
                <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                    <h1 className="font-sans font-semibold text-3xl sm:text-4xl tracking-tight text-slate-800 dark:text-slate-100">Account Profile</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Manage your identity, settings, and view your department hierarchy.</p>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column (Identity & Hierarchy) */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Personal Summary */}
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Identity Summary</h3>
                                <div className="flex items-center space-x-6">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-md border-4 border-white dark:border-slate-800">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1">
                                        <div className="col-span-2">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                                            <p className="font-semibold text-sm text-gray-800 dark:text-slate-200 uppercase">{user.department || 'Unassigned'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Level</p>
                                            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize border border-blue-100">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Department Structure */}
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Management Chain</h3>
                                <div className="space-y-4">
                                    {(user.role === 'employee' || user.role === 'manager') && (
                                        <ProfileCard title="Direct Team Lead" person={teamLeads[0]} iconColor="orange" />
                                    )}
                                    {(user.role === 'employee' || user.role === 'teamlead') && (
                                        <ProfileCard title="Department Manager" person={managers[0]} iconColor="emerald" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Settings & Security) */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 h-full flex flex-col justify-start">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">System Preferences</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-slate-700/50">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">Two-Factor Authentication</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account.</p>
                                        </div>
                                        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">Disabled</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-slate-700/50">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">Email Notifications</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive updates for pending requests.</p>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">Enabled</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-slate-700/50">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">Timezone Settings</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Localize timestamp calculations.</p>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-700 px-3 py-1 border border-gray-200 dark:border-slate-600 rounded">UTC -5:00</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-slate-700/50 pb-3 mb-4">Security Access</h3>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Current Password</label>
                                            <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">New System Password</label>
                                            <input type="password" required minLength="6" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                                        </div>
                                        <button type="submit" disabled={updatingParams || !passwordData.currentPassword || !passwordData.newPassword} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-800 transition w-full">
                                            {updatingParams ? 'Updating...' : 'Update Active Password'}
                                        </button>
                                    </form>
                                </div>
                                
                                <div className="mt-auto pt-8">
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex items-start space-x-3">
                                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <div>
                                            <p className="text-sm font-bold text-blue-900">Need modifications?</p>
                                            <p className="text-xs text-blue-700 mt-1">Contact your directory administrator to change core department fields or organizational roles.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Profile;
