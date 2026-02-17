import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import RequestForm from '../components/employee/RequestForm';
import { requestService } from '../services/requestService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import { REQUEST_TYPE_LABELS } from '../utils/constants';
import { SocketContext } from '../context/SocketContext';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'leave', 'purchase', 'expense'

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if (socket) {
            socket.on('notification', () => {
                setRefreshTrigger(prev => prev + 1);
            });
            return () => socket.off('notification');
        }
    }, [socket]);

    useEffect(() => {
        fetchRequests();
    }, [refreshTrigger]);

    const fetchRequests = async () => {
        try {
            const response = await requestService.getMyRequests();
            if (response.success) {
                setRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        toast.success("Request submitted successfully!")
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this request?')) return;
        try {
            await requestService.deleteRequest(id);
            toast.success('Request deleted successfully');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete request');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
            case 'pending':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
            case 'approved_by_teamlead':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">TL Approved</span>;
            case 'rejected':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Rejected</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const filteredRequests = requests.filter(request => {
        // Filter by Status Tab
        let statusMatch = true;
        if (activeTab === 'pending') {
            statusMatch = request.status === 'pending' || request.status === 'approved_by_teamlead';
        } else if (activeTab === 'approved') {
            statusMatch = request.status === 'approved';
        } else if (activeTab === 'rejected') {
            statusMatch = request.status === 'rejected';
        }

        // Filter by Type
        let typeMatch = true;
        if (typeFilter !== 'all') {
            typeMatch = request.requestType === typeFilter;
        }

        return statusMatch && typeMatch;
    });

    const RequestCard = ({ request }) => (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 mb-4 group relative">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <span className={`p-3 rounded-xl ${request.requestType === 'purchase' ? 'bg-purple-50 text-purple-600' :
                        request.requestType === 'leave' ? 'bg-orange-50 text-orange-600' :
                            'bg-blue-50 text-blue-600'
                        }`}>
                        {request.requestType === 'purchase' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>}
                        {request.requestType === 'leave' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                        {request.requestType === 'expense' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    </span>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">{REQUEST_TYPE_LABELS[request.requestType]}</h4>
                        <span className="text-xs text-gray-400 font-medium">Submitted on {formatDate(request.createdAt)}</span>
                    </div>
                </div>
                {getStatusBadge(request.status)}
            </div>

            <div className="mb-4 pl-14">
                {request.requestType === 'leave' && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                        <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">From</p><p className="font-semibold text-gray-800">{formatDate(request.leaveDetails.fromDate)}</p></div>
                        <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">To</p><p className="font-semibold text-gray-800">{formatDate(request.leaveDetails.toDate)}</p></div>
                        <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</p><p className="font-semibold text-gray-800">{request.leaveDetails.numberOfDays} Days</p></div>
                        <div className="col-span-full pt-2 border-t border-gray-200 mt-2"><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Reason</p><p className="font-medium text-gray-700 italic">"{request.leaveDetails.reason}"</p></div>
                    </div>
                )}

                {request.requestType === 'purchase' && (
                    <div className="text-sm bg-gray-50/80 p-4 rounded-xl border border-gray-100 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Item Name</p><p className="font-semibold text-gray-800">{request.purchaseDetails.productName}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Cost</p><p className="font-bold text-gray-900 text-lg">${request.purchaseDetails.marketPrice}</p></div>
                        </div>
                        <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Reason</p><p className="font-medium text-gray-700 italic">"{request.purchaseDetails.reason}"</p></div>
                        {request.purchaseDetails.documentUrl && (
                            <a href={request.purchaseDetails.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold text-xs mt-2">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                View PDF
                            </a>
                        )}
                    </div>
                )}

                {request.requestType === 'expense' && (
                    <div className="text-sm bg-gray-50/80 p-4 rounded-xl border border-gray-100 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Description</p><p className="font-semibold text-gray-800">{request.expenseDetails.description}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Amount</p><p className="font-bold text-gray-900 text-lg">${request.expenseDetails.amount}</p></div>
                        </div>
                        {request.expenseDetails.receiptUrl && (
                            <a href={request.expenseDetails.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold text-xs mt-2">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                View Receipt
                            </a>
                        )}
                    </div>
                )}
            </div>

            {(request.teamLeadApproval?.comment || request.managerApproval?.comment || request.rejectionReason) && (
                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl flex flex-col space-y-2">
                    {request.teamLeadApproval?.comment && (
                        <div className="flex items-start text-sm"><span className="font-bold text-gray-500 w-24 flex-shrink-0">Team Lead:</span> <span className="text-gray-700">{request.teamLeadApproval.comment}</span></div>
                    )}
                    {request.managerApproval?.comment && (
                        <div className="flex items-start text-sm"><span className="font-bold text-gray-500 w-24 flex-shrink-0">Manager:</span> <span className="text-gray-700">{request.managerApproval.comment}</span></div>
                    )}
                    {request.rejectionReason && (
                        <div className="flex items-start text-sm"><span className="font-bold text-rose-500 w-24 flex-shrink-0">Rejection:</span> <span className="text-rose-600">{request.rejectionReason}</span></div>
                    )}
                </div>
            )}

            {/* Delete Button */}
            {['pending', 'approved_by_teamlead', 'rejected'].includes(request.status) && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(request._id); }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-rose-500 transition-all rounded-lg shadow-sm border border-gray-200 hover:border-rose-500"
                        title="Delete Request"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Requests</h1>
                        <p className="mt-2 text-gray-500 font-medium">Manage and track your request status</p>
                    </div>
                    {/* Add Request Button could go here if we wanted a modal instead of side form */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <RequestForm onSuccess={handleSuccess} />
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Status Tabs */}
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Requested
                                </button>
                                <button
                                    onClick={() => setActiveTab('approved')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'approved' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => setActiveTab('rejected')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'rejected' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Rejected
                                </button>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    All
                                </button>
                            </div>

                            {/* Type Filter */}
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2 font-medium">Category:</span>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="leave">Leave Request</option>
                                    <option value="purchase">Purchase Request</option>
                                    <option value="expense">Expense Request</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="space-y-6">
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map(request => (
                                        <RequestCard key={request._id} request={request} />
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                                        <p className="text-gray-500 mt-1">Try adjusting your filters or create a new request.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
