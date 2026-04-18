import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const getDashboardRoute = () => {
        if (!user) return '/login';
        return `/${user.role}/dashboard`;
    };

    const handleMockClick = (e, name) => {
        e.preventDefault();
        toast.success(`${name} feature coming soon!`, { icon: '🚀' });
    };

    const navItems = [
        { name: 'Dashboard', path: getDashboardRoute(), icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        )},
        { name: 'Directory', path: '/users', icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        )},
        { name: 'Activities', path: '/activities', icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        )},
        { name: 'Profile', path: '/profile', icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        )},
    ];

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-brand-sidebar dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300`}>
            <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-8 justify-between'} border-b border-gray-50 dark:border-slate-800/50`}>
                <h1 className={`text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                    BizLink<span className="text-brand-accent">.</span>
                </h1>
                {isCollapsed && (
                    <h1 className="text-2xl font-extrabold tracking-tight text-brand-accent block">
                        B.
                    </h1>
                )}
                <button onClick={onToggle} className={`text-gray-400 hover:text-gray-600 transition ${isCollapsed ? 'hidden' : 'block'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                </button>
            </div>

            <div className={`flex-1 overflow-y-auto py-6 space-y-2 ${isCollapsed ? 'px-3' : 'px-4'}`}>
                {isCollapsed && (
                    <div className="flex justify-center mb-6">
                        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 transition p-2 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                )}
                <div className={`text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ${isCollapsed ? 'text-center text-[10px]' : 'px-4'}`}>
                    {isCollapsed ? 'Nav' : 'Menu'}
                </div>
                {navItems.map((item) => {
                    const isActive = location.pathname.includes(item.path) && item.path !== '#';
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={item.mock ? (e) => handleMockClick(e, item.name) : undefined}
                            className={`flex items-center space-x-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                                isCollapsed ? 'px-0 justify-center' : 'px-4'
                            } ${
                                isActive 
                                ? 'bg-gray-100/50 text-gray-900 dark:bg-slate-800 dark:text-white font-bold' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                            }`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <span className={`${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-400'}`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    )
                })}
            </div>

            <div className={`p-4 border-t border-gray-50 dark:border-slate-800/50 flex flex-col space-y-4`}>
                {/* Projects mock */}
                {!isCollapsed && (
                    <div>
                        <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-3">
                            Projects
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 dark:text-slate-400 font-medium">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span>Approvals Hub</span>
                            </div>
                            <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 dark:text-slate-400 font-medium">
                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                <span>Leave Requests</span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Logout Button */}
                <button 
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }} 
                    className={`flex items-center text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-xl transition-all ${isCollapsed ? 'justify-center p-3 w-full' : 'px-4 py-3 space-x-3'}`}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
