import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-brand-bg dark:bg-slate-900 font-sans text-brand-text transition-colors duration-300 flex">
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} flex flex-col pt-0 transition-all duration-300`}>
                <TopBar />
                <main className="flex-1 overflow-x-hidden p-8 px-10">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
