import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';
import NotificationBell from '../notifications/NotificationBell';
import Modal from './Modal';
import toast from 'react-hot-toast';

const TopBar = ({ isSidebarCollapsed }) => {
    const { user, logout, updateSignaturePin } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [oldPin, setOldPin] = useState('');
    const [pin, setPin] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePinSetup = async (e) => {
        e.preventDefault();
        if (pin.length < 4) {
            toast.error("PIN must be at least 4 characters.");
            return;
        }
        if (user?.hasSignaturePin && (!oldPin || oldPin.length < 4)) {
            toast.error("Please enter your current PIN.");
            return;
        }
        setIsSubmitting(true);
        try {
            await updateSignaturePin(pin, oldPin);
            toast.success("Signature PIN set successfully!");
            setIsPinModalOpen(false);
            setPin('');
            setOldPin('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to set PIN");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPin = async () => {
        setIsSubmitting(true);
        try {
            await authService.forgotSignaturePin();
            toast.success("Reset link sent! Check your email or terminal.");
            setIsPinModalOpen(false);
            setPin('');
            setOldPin('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset email");
        } finally {
            setIsSubmitting(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchQuery.trim()) {
                toast("Global search is coming soon!", { icon: '🔍' });
                setSearchQuery('');
            }
        }
    };

    return (
        <header 
            className="fixed top-0 right-0 z-40 h-[88px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-8 border-b border-slate-100 dark:border-slate-800 transition-all duration-300"
            style={{ left: isSidebarCollapsed ? '80px' : '256px' }}
        >
            <div className="flex-1 max-w-2xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search workspace, requests, people..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="block w-full pl-11 pr-16 py-2 border border-slate-200 dark:border-slate-700 rounded-full bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                        style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 shadow-sm">⌘K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-6 ml-8">
                <button
                    onClick={toggleTheme}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    {isDarkMode ? (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
                    )}
                </button>

                <NotificationBell />

                <div className="flex items-center space-x-3 pl-6 border-l border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow hover:bg-emerald-600 transition text-sm cursor-pointer" onClick={logout} title="Click to logout">
                        {user?.name?.charAt(0)?.toLowerCase() || 'u'}
                    </div>
                    <div className="text-left hidden md:block select-none">
                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </div>

                {(user?.role === 'teamlead' || user?.role === 'manager') && (
                    <button
                        onClick={() => setIsPinModalOpen(true)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
                            user.hasSignaturePin 
                            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50' 
                            : 'bg-gray-900 text-white hover:shadow-md'
                        }`}
                    >
                        {user.hasSignaturePin ? 'Update PIN' : '+ Setup PIN'}
                    </button>
                )}
            </div>

            {/* Signature PIN Modal */}
            <Modal
                isOpen={isPinModalOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsPinModalOpen(false);
                        setPin('');
                        setOldPin('');
                    }
                }}
                title={user?.hasSignaturePin ? "Update Signature PIN" : "Signature PIN Setup"}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                        Your Signature PIN is used to securely sign approvals.
                    </p>
                    <form onSubmit={handlePinSetup} className="space-y-4">
                        {user?.hasSignaturePin && (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Current PIN / Passphrase</label>
                                    <button
                                        type="button"
                                        onClick={handleForgotPin}
                                        className="text-xs text-brand-accent hover:underline font-medium"
                                    >
                                        Forgot PIN?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    value={oldPin}
                                    onChange={(e) => setOldPin(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#eef2f6] dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-brand-accent focus:border-brand-accent text-gray-900 dark:text-white"
                                    placeholder="Enter your current PIN"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{user?.hasSignaturePin ? 'New PIN / Passphrase' : 'Enter New PIN / Passphrase'}</label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-brand-accent focus:border-brand-accent text-gray-900 dark:text-white"
                                placeholder="Min 4 characters"
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setIsPinModalOpen(false)}
                                disabled={isSubmitting}
                                className="mr-3 px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || pin.length < 4}
                                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
                            >
                                {isSubmitting ? 'Saving...' : 'Save PIN'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </header>
    );
};

export default TopBar;
