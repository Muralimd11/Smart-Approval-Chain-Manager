import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserDirectory = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authService.getAllUsers();
                setUsers(response.data);
            } catch (err) {
                setError('Failed to load user directory');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <LoadingSpinner />;

    const employees = users.filter(u => u.role === 'employee');
    const teamLeads = users.filter(u => u.role === 'teamlead');
    const managers = users.filter(u => u.role === 'manager');

    const UserSection = ({ title, users, color }) => (
        <div className="mb-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
            <div className={`px-6 py-5 border-b border-gray-100 dark:border-slate-700/50 bg-${color}-50/30 dark:bg-slate-800/80 flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                    <div className={`w-2 h-6 bg-${color}-400 rounded-full`}></div>
                    <h3 className={`text-base font-bold text-${color}-900 dark:text-${color}-400 uppercase tracking-widest`}>
                        {title}
                    </h3>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-xs font-medium text-gray-500">Active Directory Block</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 shadow-sm border border-gray-200 dark:border-slate-600 px-3 py-1 rounded-full">{users.length} members</span>
                </div>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-slate-700/50">
                {users.length === 0 ? (
                    <div className="px-6 py-8 text-center text-sm text-gray-400">No {title.toLowerCase()} found in this workspace.</div>
                ) : (
                    users.map(user => (
                        <div key={user._id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50/80 dark:hover:bg-slate-700/50 transition-colors gap-4">
                            
                            {/* User Identity Column */}
                            <div className="flex items-center space-x-4 flex-1">
                                <div className={`relative h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600 font-bold text-lg shadow-sm border border-${color}-200`}>
                                    {user.name.charAt(0)}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{user.email}</p>
                                </div>
                            </div>
                            
                            {/* Meta Data Columns */}
                            <div className="flex items-center space-x-8 md:space-x-12 flex-1 md:justify-end">
                                <div className="text-left md:text-right hidden sm:block">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Office</p>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase">{user.department || 'Corporate'}</p>
                                </div>
                                <div className="text-left md:text-right hidden sm:block">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Role</p>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 capitalize">{user.role}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <button className="text-sm font-bold text-brand-accent hover:text-brand-accent/80 hover:underline px-4 py-2 border border-brand-accent/20 rounded-lg hover:bg-brand-accent/5 transition-colors">
                                        View Log
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                    <div>
                        <h1 className="font-sans font-semibold text-3xl sm:text-4xl tracking-tight text-slate-800 dark:text-slate-100">Workspace Directory</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">View and manage all connected organizational members across departments.</p>
                    </div>
                    <div className="flex space-x-3">
                         <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search peers..." 
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-sm"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                         </div>
                    </div>
                    <button onClick={() => window.history.back()} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        &larr; Back
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <UserSection title="Managers" users={managers} color="indigo" />
                <UserSection title="Team Leads" users={teamLeads} color="purple" />
                <UserSection title="Employees" users={employees} color="blue" />
        </div>
        </Layout>
    );
};

export default UserDirectory;
