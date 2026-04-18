import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';
import NotificationBell from '../notifications/NotificationBell';
import Modal from './Modal';
import toast from 'react-hot-toast';

const TopBar = () => {
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
        <header className="h-20 bg-brand-bg dark:bg-slate-900 flex items-center justify-between px-8 transition-colors duration-300">
            <div className="flex-1 max-w-lg">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="block w-full pl-10 pr-3 py-2 border-none rounded-full bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all shadow-sm dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6 ml-4">
                <button
                    onClick={toggleTheme}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    {isDarkMode ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                </button>

                <NotificationBell />

                <div className="flex items-center space-x-3 pl-6 border-l border-gray-200 dark:border-slate-700">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:bg-blue-700 transition" onClick={logout} title="Click to logout">
                        {user?.name?.charAt(0) || 'U'}
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
