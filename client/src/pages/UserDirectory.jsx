import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import Navbar from '../components/common/Navbar';
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
        <div className="mb-8">
            <h3 className={`text-xl font-bold mb-4 text-${color}-800 dark:text-${color}-400 border-b-2 border-${color}-200 dark:border-${color}-800/30 pb-2`}>
                {title} ({users.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user._id} className="bg-[#eef2f6] dark:bg-slate-800/80 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className={`h-12 w-12 rounded-full bg-${color}-100 dark:bg-${color}-500/20 flex items-center justify-center text-${color}-600 dark:text-${color}-400 font-bold text-lg`}>
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
                                <p className="text-xs font-medium text-gray-400 dark:text-slate-500 mt-1 uppercase">{user.department || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Directory</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">View details of all employees, team leads, and managers.</p>
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
        </div>
    );
};

export default UserDirectory;
