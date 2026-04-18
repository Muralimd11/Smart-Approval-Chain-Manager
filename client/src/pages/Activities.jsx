import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../hooks/useAuth';
import { requestService } from '../services/requestService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Activities = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = user.role === 'employee' 
                    ? await requestService.getMyRequests()
                    : await requestService.getAllRequests();
                    
                if (response.success || response.data) {
                    const data = response.data || response;
                    setRequests(data);
                }
            } catch (err) {
                console.error("Failed to fetch activities", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [user]);

    // Apply Filters
    const filteredRequests = requests.filter(r => filterCategory === 'all' || r.requestType === filterCategory);

    let total = filteredRequests.length;
    let approved = 0;
    let rejected = 0;
    let pending = 0;

    filteredRequests.forEach(req => {
        if (req.status === 'approved') approved++;
        else if (req.status === 'rejected') rejected++;
        else pending++; 
    });

    const approvedAngle = total === 0 ? 0 : (approved / total) * 100;
    const rejectedAngle = total === 0 ? 0 : (rejected / total) * 100;
    const pendingAngle = total === 0 ? 0 : (pending / total) * 100;

    const conicGradientString = total === 0 
        ? "conic-gradient(#e2e8f0 0% 100%)" // empty gray pie
        : `conic-gradient(
            #10b981 0% ${approvedAngle}%, 
            #ef4444 ${approvedAngle}% ${approvedAngle + rejectedAngle}%, 
            #f59e0b ${approvedAngle + rejectedAngle}% 100%
        )`;


    const recentRequests = [...filteredRequests]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getRequestTitle = (req) => {
        if (req.requestType === 'leave') return `Leave request — ${req.leaveDetails?.reason || 'Standard'}`;
        if (req.requestType === 'purchase') return `${req.purchaseDetails?.productName || 'Equipment'} purchase`;
        if (req.requestType === 'expense') return `Expense reimbursement — $${req.expenseDetails?.amount || '0'}`;
        return 'Standard Request';
    };

    const getIcon = (type) => {
        if (type === 'leave') {
            return (
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
            );
        } else if (type === 'purchase') {
            return (
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
            );
        } else {
            return (
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
            );
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Activities</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Review operational metrics and log histories.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Filter By</span>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 font-medium text-sm rounded-xl focus:ring-brand-accent focus:border-brand-accent block p-2.5 shadow-sm min-w-[160px]"
                        >
                            <option value="all">All Operations</option>
                            <option value="leave">Leave Requests</option>
                            <option value="purchase">Purchase Orders</option>
                            <option value="expense">Expense Logs</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Metrics Layout (Pie Chart + Stacked Pills) */}
                        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
                                {/* Native CSS Pie Chart */}
                                <div className="relative flex-none">
                                    <div 
                                        className="w-48 h-48 rounded-full shadow-inner transform transition-all hover:scale-105 duration-500"
                                        style={{ background: conicGradientString }}
                                    ></div>
                                    <div className="absolute inset-0 bg-white dark:bg-slate-800 w-28 h-28 rounded-full m-auto flex items-center justify-center shadow-sm">
                                        <div className="text-center">
                                            <span className="block text-3xl font-black text-gray-900 dark:text-white">{total}</span>
                                            <span className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Metrics Stack */}
                                <div className="flex-1 w-full space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-white transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                                            <span className="font-semibold text-gray-700">Approved</span>
                                        </div>
                                        <span className="font-black text-gray-900 text-lg">{approved}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-white transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="font-semibold text-gray-700">Rejected</span>
                                        </div>
                                        <span className="font-black text-gray-900 text-lg">{rejected}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-white transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></div>
                                            <span className="font-semibold text-gray-700">Pending Actions</span>
                                        </div>
                                        <span className="font-black text-gray-900 text-lg">{pending}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Requests Data Table */}
                        <div className="lg:col-span-12 xl:col-span-4 h-full">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                                <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-gray-50/30">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Recent requests</h2>
                                        <p className="text-xs text-gray-500 mt-1">Latest activity logs</p>
                                    </div>
                                    <button className="text-sm font-bold text-brand-accent hover:underline">View all &nearr;</button>
                                </div>
                                <div className="divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[350px]">
                                    {recentRequests.length === 0 ? (
                                        <div className="p-6 text-center text-sm text-gray-500">No requests found.</div>
                                    ) : (
                                        recentRequests.map(req => (
                                            <div key={req._id} className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
                                                {getIcon(req.requestType)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {getRequestTitle(req)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        REQ-{req._id.slice(-4).toUpperCase()} &bull; <span className="capitalize">{req.requestType}</span> &bull; {formatDate(req.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Activities;
