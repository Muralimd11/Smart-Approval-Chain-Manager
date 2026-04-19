import React from 'react';
import Layout from '../components/common/Layout';

const MyCalendar = () => {
    // Generate dates for April 2026 (starts on Wednesday)
    const renderCalendarDays = () => {
        const days = [];
        // Empty slots for Sunday, Monday, Tuesday
        for (let i = 0; i < 3; i++) {
            days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/30 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 p-2"></div>);
        }
        
        for (let i = 1; i <= 30; i++) {
            let badge = null;
            if (i === 11) badge = <div className="mt-1 text-xs px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 font-medium rounded truncate">Earned le...</div>;
            if (i === 14) badge = <div className="mt-1 text-xs px-2 py-1 bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 font-medium rounded truncate">WFH</div>;
            if (i === 21 || i === 22) badge = <div className="mt-1 text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 font-medium rounded truncate">Leave (Med...</div>;
            
            // Highlight today (say, April 14 in this mockup)
            const isToday = i === 14;

            days.push(
                <div key={`day-${i}`} className={`min-h-[100px] border border-slate-100 dark:border-slate-800 p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-800'}`}>
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-semibold ${isToday ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700 dark:text-slate-300'}`}>{i}</span>
                    </div>
                    {badge}
                </div>
            );
        }

        // Fill remainder of 5 weeks (35 cells total)
        for (let i = 0; i < 2; i++) {
            days.push(<div key={`empty-end-${i}`} className="min-h-[100px] bg-slate-50/30 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 p-2"></div>);
        }

        return days;
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-8">
                {/* Header Container */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 mb-8 relative">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="text-xs font-bold uppercase tracking-widest">Schedule</span>
                            </div>
                            <h1 className="font-sans font-semibold text-3xl sm:text-4xl tracking-tight text-slate-800 dark:text-slate-100">My Calendar</h1>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">Your approved &amp; pending leave, work-from-home days, and public holidays in one view.</p>
                        </div>
                        <div className="flex space-x-2 self-start md:self-auto mt-2 md:mt-0">
                            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition">
                                Today
                            </button>
                            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Approved leave</span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>Pending leave</span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 rounded-full text-xs font-bold text-teal-700 dark:text-teal-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                            <span>Work from home</span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                            <span>Public holiday</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar grid */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">April 2026</h2>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">5 Events</span>
                        </div>
                        
                        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest border-r border-slate-100 dark:border-slate-700 last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 bg-white dark:bg-slate-800">
                            {renderCalendarDays()}
                        </div>
                    </div>

                    {/* This Month sidebar */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center space-x-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">This Month</h2>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Card 1 */}
                            <div className="flex bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="w-16 bg-emerald-50 dark:bg-emerald-900/10 border-r border-emerald-100 dark:border-emerald-800/30 flex flex-col items-center justify-center py-3 flex-shrink-0">
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Apr</span>
                                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">11</span>
                                </div>
                                <div className="p-3 flex items-center gap-3 w-full">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">Earned leave</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Sat · Approved leave</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="flex bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="w-16 bg-teal-50 dark:bg-teal-900/10 border-r border-teal-100 dark:border-teal-800/30 flex flex-col items-center justify-center py-3 flex-shrink-0">
                                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-500 uppercase tracking-widest">Apr</span>
                                    <span className="text-xl font-black text-teal-600 dark:text-teal-400">14</span>
                                </div>
                                <div className="p-3 flex items-center gap-3 w-full">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">WFH</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Tue · Work from home</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="flex bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="w-16 bg-amber-50 dark:bg-amber-900/10 border-r border-amber-100 dark:border-amber-800/30 flex flex-col items-center justify-center py-3 flex-shrink-0">
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Apr</span>
                                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">21</span>
                                </div>
                                <div className="p-3 flex items-center gap-3 w-full">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">Leave (Medical)</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Tue · Pending leave</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="flex bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="w-16 bg-amber-50 dark:bg-amber-900/10 border-r border-amber-100 dark:border-amber-800/30 flex flex-col items-center justify-center py-3 flex-shrink-0">
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Apr</span>
                                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">22</span>
                                </div>
                                <div className="p-3 flex items-center gap-3 w-full">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">Leave (Medical)</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Wed · Pending leave</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MyCalendar;
