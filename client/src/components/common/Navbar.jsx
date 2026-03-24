import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';
import Modal from './Modal';
import toast from 'react-hot-toast';

const Navbar = () => {
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

    return (
        <nav className="bg-[#eef2f6]/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-md border-b border-slate-200/50 dark:border-slate-800/80 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 dark:from-indigo-400 dark:to-blue-400 tracking-tight flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Smart Approval Chain
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>

                        <NotificationBell />

                        <div className="flex items-center space-x-5 border-l border-gray-200 dark:border-slate-700 pl-4 sm:pl-6 ml-2">
                            <Link to="/users" className="text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white font-medium text-sm transition-colors">Directory</Link>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-300 capitalize">{user?.role}</p>
                            </div>

                            {(user?.role === 'teamlead' || user?.role === 'manager') && (
                                <button
                                    onClick={() => setIsPinModalOpen(true)}
                                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
                                        user.hasSignaturePin 
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-white border border-slate-200 dark:border-slate-700' 
                                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-md hover:-translate-y-0.5 shadow-indigo-500/25'
                                    }`}
                                >
                                    {user.hasSignaturePin ? 'Update PIN' : 'Setup PIN'}
                                </button>
                            )}

                            <button
                                onClick={logout}
                                className="bg-slate-100 hover:bg-rose-500 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-500 dark:hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
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
                        Your Signature PIN is used to securely sign approvals. This ensures that even if someone accesses your account, they cannot approve requests without your secret PIN.
                    </p>
                    <form onSubmit={handlePinSetup} className="space-y-4">
                        {user?.hasSignaturePin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Current PIN / Passphrase</label>
                                <input
                                    type="password"
                                    value={oldPin}
                                    onChange={(e) => setOldPin(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#eef2f6] dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
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
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
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
                                className="bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save PIN'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </nav>
    );
};

export default Navbar;
