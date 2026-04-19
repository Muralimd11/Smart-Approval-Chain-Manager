import React, { useState, useEffect, useContext, useCallback } from 'react';
import Layout from '../components/common/Layout';
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

    const renderCertificate = (approval, title) => {
        if (!approval || !approval.signature) return null;
        return (
            <div className="mt-3 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/30 rounded-lg p-3 text-xs font-mono">
                <div className="flex items-center text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    {title} Approval Verification
                </div>
                <div className="grid grid-cols-1 gap-1 text-gray-600 dark:text-slate-400">
                    <div><span className="text-gray-400 dark:text-slate-500 select-none">Timestamp:</span> {formatDate(approval.approvedAt)}</div>
                </div>
            </div>
        );
    };

    const { socket } = useContext(SocketContext);

    const fetchRequests = useCallback(async () => {
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
    }, []);

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
    }, [refreshTrigger, fetchRequests]);

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
                return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center shadow-sm"><svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Approved</span>;
            case 'pending':
                return <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 flex items-center shadow-sm"><svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pending</span>;
            case 'approved_by_teamlead':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">TL Approved</span>;
            case 'rejected':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">Rejected</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-700/50 text-gray-800 dark:text-slate-300">{status}</span>;
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 mb-5 group relative shadow-sm transition-all animate-fade-in-up">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <span className={`p-3 rounded-xl ${
                        request.requestType === 'purchase' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        request.requestType === 'expense' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        request.requestType === 'leave' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        request.requestType === 'travel' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' :
                        request.requestType === 'wfh' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        request.requestType === 'training' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400' // Shift
                    }`}>
                        {request.requestType === 'purchase' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>}
                        {request.requestType === 'expense' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        {request.requestType === 'leave' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                        {request.requestType === 'travel' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        {request.requestType === 'wfh' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>}
                        {request.requestType === 'training' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                        {request.requestType === 'shift' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    </span>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{REQUEST_TYPE_LABELS[request.requestType]}</h4>
                        <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Submitted on {formatDate(request.createdAt)}</span>
                    </div>
                </div>
                {getStatusBadge(request.status)}
            </div>

            <div className="mb-4 pl-14">
                {request.requestType === 'leave' && (
                    <div className="text-sm">
                        <div className="grid grid-cols-3 gap-4 bg-[#F9FAFB] dark:bg-slate-700/30 p-5 rounded-xl border border-gray-100 dark:border-slate-700/50 mb-4">
                            <div><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">From</p><p className="font-semibold text-gray-900">{formatDate(request.leaveDetails?.fromDate)}</p></div>
                            <div><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">To</p><p className="font-semibold text-gray-900">{formatDate(request.leaveDetails?.toDate)}</p></div>
                            <div><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Duration</p><p className="font-semibold text-gray-900">{request.leaveDetails?.numberOfDays} Days</p></div>
                        </div>
                        <div><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Reason</p><p className="font-medium text-gray-700 italic">"{request.leaveDetails?.reason}"</p></div>
                    </div>
                )}

                {request.requestType === 'purchase' && (
                    <div className="text-sm bg-[#eef2f6]/80 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Item Name</p><p className="font-semibold text-gray-800 dark:text-slate-200">{request.purchaseDetails?.productName}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Cost</p><p className="font-bold text-gray-900 dark:text-white text-lg">${request.purchaseDetails?.marketPrice}</p></div>
                        </div>
                        <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Reason</p><p className="font-medium text-gray-700 dark:text-slate-300 italic">"{request.purchaseDetails?.reason}"</p></div>
                        {request.purchaseDetails?.documentUrl && (
                            <a href={request.purchaseDetails.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-xs mt-2">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                View PDF
                            </a>
                        )}
                    </div>
                )}

                {request.requestType === 'expense' && (
                    <div className="text-sm bg-[#eef2f6]/80 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Description</p><p className="font-semibold text-gray-800 dark:text-slate-200">{request.expenseDetails?.description}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Amount</p><p className="font-bold text-gray-900 dark:text-white text-lg">${request.expenseDetails?.amount}</p></div>
                        </div>
                        {request.expenseDetails?.receiptUrl && (
                            <a href={request.expenseDetails.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-xs mt-2">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                View Receipt
                            </a>
                        )}
                    </div>
                )}

                {request.requestType === 'travel' && (
                    <div className="text-sm bg-[#eef2f6]/80 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Destination</p>
                                <p className="font-semibold text-gray-800 dark:text-slate-200">{request.travelDetails?.destination.city}, {request.travelDetails?.destination.country}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Est. Cost</p>
                                <p className="font-bold text-gray-900 dark:text-white text-lg">${request.travelDetails?.estimatedExpenses.total}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Departure</p><p className="font-semibold text-gray-800 dark:text-slate-200">{formatDate(request.travelDetails?.departureDate)}</p></div>
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Return</p><p className="font-semibold text-gray-800 dark:text-slate-200">{formatDate(request.travelDetails?.returnDate)}</p></div>
                        </div>
                        {request.travelDetails?.documentUrl && (
                             <a href={request.travelDetails.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-xs mt-2">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> View Itinerary Docs
                            </a>
                        )}
                    </div>
                )}

                {request.requestType === 'wfh' && (
                    <div className="text-sm bg-[#eef2f6]/80 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 flex flex-col space-y-3">
                         <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">WFH Dates</p><p className="font-semibold text-gray-800 dark:text-slate-200">{formatDate(request.wfhDetails?.fromDate)} to {formatDate(request.wfhDetails?.toDate)}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Schedule</p><span className="font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">{request.wfhDetails?.wfhType}</span></div>
                        </div>
                        <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Primary Reason</p><p className="font-medium text-gray-700 dark:text-slate-300 italic">"{request.wfhDetails?.reasonCategory}: {request.wfhDetails?.detailedReason}"</p></div>
                    </div>
                )}

                {request.requestType === 'training' && (
                    <div className="text-sm bg-[#eef2f6]/80 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 flex flex-col space-y-3">
                         <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Course Title</p><p className="font-semibold text-gray-800 dark:text-slate-200">{request.trainingDetails?.courseName}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Course Cost</p><p className="font-bold text-gray-900 dark:text-white text-lg">${request.trainingDetails?.totalCost}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Format</p><p className="font-semibold text-gray-800 dark:text-slate-200">{request.trainingDetails?.courseType} / {request.trainingDetails?.provider}</p></div>
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Duration</p><p className="font-semibold text-gray-800 dark:text-slate-200">{formatDate(request.trainingDetails?.startDate)} to {formatDate(request.trainingDetails?.endDate)}</p></div>
                        </div>
                        {request.trainingDetails?.documentUrl && (
                             <a href={request.trainingDetails.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-xs mt-2">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> View Syllabus
                            </a>
                        )}
                    </div>
                )}

                {request.requestType === 'shift' && (
                    <div className="text-sm bg-[#eef2f6]/80 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 flex flex-col space-y-3">
                         <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <div>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Shift Modification</p>
                                <p className="font-semibold text-gray-800 dark:text-slate-200">{request.shiftDetails?.currentShift.shiftType} &rarr; {request.shiftDetails?.requestedShift.shiftType}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Duration</p>
                                <span className="font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs">{request.shiftDetails?.changeType}</span>
                            </div>
                        </div>
                        <div><p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Effective Date</p><p className="font-medium text-gray-700 dark:text-slate-300">{formatDate(request.shiftDetails?.effectiveFrom)}</p></div>
                        {request.shiftDetails?.documentUrl && (
                             <a href={request.shiftDetails.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-xs mt-2">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> View Medical/Supporting Doc
                            </a>
                        )}
                    </div>
                )}
            </div>

            {(request.teamLeadApproval?.comment || request.managerApproval?.comment || request.rejectionReason || request.teamLeadApproval?.signature || request.managerApproval?.signature) && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 bg-[#eef2f6]/60 dark:bg-slate-800/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl flex flex-col space-y-2">
                    {request.teamLeadApproval?.comment && (
                        <div className="flex items-start text-sm"><span className="font-bold text-gray-500 dark:text-slate-400 w-24 flex-shrink-0">Team Lead:</span> <span className="text-gray-700 dark:text-slate-300">{request.teamLeadApproval.comment}</span></div>
                    )}
                    {renderCertificate(request.teamLeadApproval, "Team Lead")}
                    
                    {request.managerApproval?.comment && (
                        <div className="flex items-start text-sm mt-3"><span className="font-bold text-gray-500 dark:text-slate-400 w-24 flex-shrink-0">Manager:</span> <span className="text-gray-700 dark:text-slate-300">{request.managerApproval.comment}</span></div>
                    )}
                    {renderCertificate(request.managerApproval, "Manager")}
                    
                    {request.rejectionReason && (!request.teamLeadApproval?.comment && !request.managerApproval?.comment) && (
                        <div className="flex items-start text-sm"><span className="font-bold text-rose-500 w-24 flex-shrink-0">Rejection:</span> <span className="text-rose-600 dark:text-rose-400">{request.rejectionReason}</span></div>
                    )}
                </div>
            )}

            {/* Delete Button */}
            {['pending', 'approved_by_teamlead', 'rejected'].includes(request.status) && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(request._id); }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 transition-all rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 hover:border-rose-500 dark:hover:border-rose-600"
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
        <Layout>
            <div className="max-w-7xl mx-auto py-2 px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                    <div>
                        <div className="flex items-center text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Requests
                        </div>
                        <h1 className="font-sans font-semibold text-3xl sm:text-4xl tracking-tight text-slate-800 dark:text-slate-100">My Requests</h1>
                        <p className="mt-1 text-gray-500 dark:text-slate-400 font-medium">Manage and track your request status across the workspace.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-2 text-center min-w-[90px] shadow-sm">
                            <span className="block text-2xl font-black text-brand-accent leading-none">{requests.length}</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-widest block mt-1">Total</span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-2 text-center min-w-[90px] shadow-sm">
                            <span className="block text-2xl font-black text-emerald-500 leading-none">{requests.filter(r => r.status === 'approved').length}</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-widest block mt-1">Approved</span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-2 text-center min-w-[90px] shadow-sm">
                            <span className="block text-2xl font-black text-amber-500 leading-none">{requests.filter(r => r.status === 'pending' || r.status === 'approved_by_teamlead').length}</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-widest block mt-1">Pending</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5">
                        <div className="sticky top-6">
                            <RequestForm onSuccess={handleSuccess} />
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        {/* Filters */}
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-1.5 px-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                            {/* Status Tabs */}
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600' : 'text-gray-500 hover:text-gray-700 border border-transparent'}`}
                                >
                                    Requested
                                </button>
                                <button
                                    onClick={() => setActiveTab('approved')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'approved' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600' : 'text-gray-500 hover:text-gray-700 border border-transparent'}`}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => setActiveTab('rejected')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'rejected' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600' : 'text-gray-500 hover:text-gray-700 border border-transparent'}`}
                                >
                                    Rejected
                                </button>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600' : 'text-gray-500 hover:text-gray-700 border border-transparent'}`}
                                >
                                    All
                                </button>
                            </div>

                            {/* Type Filter */}
                            <div className="flex items-center space-x-1 pl-1">
                                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest hidden sm:inline-block">Category:</span>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="bg-transparent text-gray-900 dark:text-white text-xs font-medium focus:ring-0 focus:outline-none cursor-pointer py-1 pr-4 pl-1 border-none max-w-[110px]"
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
                                    <div className="text-center py-20 bg-[#eef2f6] dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 border-dashed">
                                        <div className="bg-[#eef2f6] dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No requests found</h3>
                                        <p className="text-gray-500 dark:text-slate-400 mt-1">Try adjusting your filters or create a new request.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeDashboard;
