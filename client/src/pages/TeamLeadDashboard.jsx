import React, { useState, useEffect, useContext, useCallback } from 'react';
import Layout from '../components/common/Layout';
import { requestService } from '../services/requestService';
import { approvalService } from '../services/approvalService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/helpers';
import { REQUEST_TYPE_LABELS } from '../utils/constants';
import toast from 'react-hot-toast';
import { SocketContext } from '../context/SocketContext';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const TeamLeadDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [comment, setComment] = useState('');
    const [signaturePin, setSignaturePin] = useState('');
    const [processing, setProcessing] = useState(false);
    const { socket } = useContext(SocketContext);
    const { user } = useAuth();
    const [departmentCount, setDepartmentCount] = useState(0);

    const fetchRequests = useCallback(async () => {
        try {
            const response = await requestService.getAllRequests();
            if (response.success) {
                setRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDepartmentUsers = useCallback(async () => {
        try {
            const response = await authService.getAllUsers();
            if (response.success || response.data) {
                const all = response.data || response;
                const members = all.filter(u => u.department === user?.department);
                setDepartmentCount(members.length);
            }
        } catch (error) {
            console.error('Failed fetching users', error);
        }
    }, [user?.department]);

    useEffect(() => {
        fetchRequests();
        if (user?.department) fetchDepartmentUsers();
    }, [fetchRequests, fetchDepartmentUsers, user?.department]);

    useEffect(() => {
        if (socket) {
            socket.on('notification', () => {
                fetchRequests();
            });
            return () => socket.off('notification');
        }
    }, [socket, fetchRequests]);

    const handleApproval = async (action) => {
        if (!signaturePin || signaturePin.length < 4) {
            toast.error("Please enter your 4+ character Signature PIN.");
            return;
        }
        setProcessing(true);
        try {
            await approvalService.teamLeadApproval(selectedRequest._id, action, comment, signaturePin);
            toast.success(`Request ${action}d successfully!`);
            setSelectedRequest(null);
            setComment('');
            setSignaturePin('');
            fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setProcessing(false);
        }
    };

    const RequestCard = ({ request }) => (
        <div className="glass-card rounded-2xl p-6 group relative animate-fade-in-up">
            <div className="flex justify-between items-start mb-4 gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span className={`flex-shrink-0 p-2.5 rounded-lg ${
                        request.requestType === 'purchase' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        request.requestType === 'expense' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        request.requestType === 'leave' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        request.requestType === 'travel' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' :
                        request.requestType === 'wfh' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        request.requestType === 'training' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400'
                    }`}>
                        {request.requestType === 'purchase' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>}
                        {request.requestType === 'leave' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                        {request.requestType === 'expense' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        {request.requestType === 'travel' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        {request.requestType === 'wfh' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>}
                        {request.requestType === 'training' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                        {request.requestType === 'shift' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    </span>
                    <div className="min-w-0 pr-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1 truncate" title={REQUEST_TYPE_LABELS[request.requestType]}>{REQUEST_TYPE_LABELS[request.requestType]}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium truncate flex items-center">
                            By <span className="font-bold text-gray-900 dark:text-white ml-1 mr-2">{request.employee?.email || request.employee?.name}</span>
                            <span className="text-xs text-slate-300 dark:text-slate-600 font-mono tracking-widest hidden sm:inline">- REQ-{request._id ? request._id.substring(request._id.length - 4).toUpperCase() : '0000'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20 shadow-sm whitespace-nowrap">Pending Review</span>
                </div>
            </div>

            <div className="bg-[#eef2f6]/80 dark:bg-slate-700/30 rounded-xl p-5 mb-5 border border-gray-100 dark:border-slate-700/50">
                {request.requestType === 'leave' && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">From</p><p className="font-medium text-gray-800 dark:text-slate-200">{formatDate(request.leaveDetails.fromDate)}</p></div>
                        <div><p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">To</p><p className="font-medium text-gray-800 dark:text-slate-200">{formatDate(request.leaveDetails.toDate)}</p></div>
                    </div>
                )}
                {request.requestType === 'purchase' && (
                    <div className="flex justify-between text-sm">
                        <div><p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Product</p><p className="font-medium text-gray-800 dark:text-slate-200">{request.purchaseDetails.productName}</p></div>
                        <div className="text-right"><p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Price</p><p className="font-medium text-gray-800 dark:text-slate-200">${request.purchaseDetails.marketPrice}</p></div>
                    </div>
                )}
                {request.requestType === 'expense' && (
                    <div className="flex justify-between text-sm">
                        <div><p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Amount</p><p className="font-medium text-gray-800 dark:text-slate-200 text-lg">${request.expenseDetails.amount}</p></div>
                    </div>
                )}
                {request.requestType === 'travel' && (
                    <div className="flex justify-between text-sm">
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Dest</p><p className="font-medium text-gray-800">{request.travelDetails?.destination.city}</p></div>
                        <div className="text-right"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date</p><p className="font-medium text-gray-800">{formatDate(request.travelDetails?.departureDate)}</p></div>
                    </div>
                )}
                {request.requestType === 'wfh' && (
                    <div className="flex justify-between text-sm">
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date</p><p className="font-medium text-gray-800">{formatDate(request.wfhDetails?.fromDate)}</p></div>
                        <div className="text-right"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Type</p><p className="font-medium text-gray-800">{request.wfhDetails?.wfhType}</p></div>
                    </div>
                )}
                {request.requestType === 'training' && (
                    <div className="flex justify-between text-sm">
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Course</p><p className="font-medium text-gray-800 truncate max-w-[120px]">{request.trainingDetails?.courseName}</p></div>
                        <div className="text-right"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Cost</p><p className="font-medium text-gray-800">${request.trainingDetails?.totalCost}</p></div>
                    </div>
                )}
                {request.requestType === 'shift' && (
                    <div className="flex justify-between text-sm">
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Move To</p><p className="font-medium text-gray-800">{request.shiftDetails?.requestedShift.shiftType}</p></div>
                        <div className="text-right"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Start</p><p className="font-medium text-gray-800">{formatDate(request.shiftDetails?.effectiveFrom)}</p></div>
                    </div>
                )}
            </div>

            <div className="flex w-full mt-2">
                <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex w-full justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl transition-colors font-bold shadow-sm"
                >
                    Review & Act
                    <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 7l-10 10M17 7H8M17 7v9"></path></svg>
                </button>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-2 px-2">
                <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <div className="flex items-center text-[10px] font-bold text-gray-500 mb-0.5 uppercase tracking-widest">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Team Approvals
                        </div>
                        <h1 className="font-sans font-semibold text-3xl sm:text-4xl tracking-tight text-slate-800 dark:text-slate-100">Team Lead Dashboard</h1>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400 font-medium">Review and manage team requests across your department.</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-500/50 rounded-2xl px-6 py-2.5 flex flex-col items-center justify-center min-w-[120px] shadow-sm animate-fade-in-up">
                            <span className="block text-3xl font-black text-amber-500 leading-none">{requests.length}</span>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mt-1 flex items-center">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1 animate-pulse"></span>
                                Pending
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Pending Review</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{requests.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Approved This Week</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">12</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Team Members</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{departmentCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl animate-fade-in w-full">
                        <div className="bg-slate-100 dark:bg-slate-700/50 p-5 rounded-full mb-5 shadow-inner">
                            <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">All caught up!</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-1">No pending requests to review at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {requests.map((request) => (
                            <RequestCard key={request._id} request={request} />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!selectedRequest}
                onClose={() => {
                    setSelectedRequest(null);
                    setSignaturePin('');
                }}
                title="Review Request"
            >
                {selectedRequest && (
                    <div className="space-y-6">
                        <div className="bg-[#eef2f6] dark:bg-slate-700/30 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                    {REQUEST_TYPE_LABELS[selectedRequest.requestType]}
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedRequest.employee?.name}</span>
                            </div>

                            <div className="mt-4 border-t border-gray-200 pt-3">
                                {selectedRequest.requestType === 'leave' && (
                                    <div className="space-y-2 text-sm text-gray-700"><p><b>From:</b> {formatDate(selectedRequest.leaveDetails.fromDate)}</p><p><b>To:</b> {formatDate(selectedRequest.leaveDetails.toDate)}</p><p><b>Reason:</b> {selectedRequest.leaveDetails.reason}</p></div>
                                )}
                                {selectedRequest.requestType === 'purchase' && (
                                    <div className="space-y-2 text-sm text-gray-700"><p><b>Product:</b> {selectedRequest.purchaseDetails.productName}</p><p><b>Cost:</b> ${selectedRequest.purchaseDetails.marketPrice}</p><p><b>Reason:</b> {selectedRequest.purchaseDetails.reason}</p></div>
                                )}
                                {selectedRequest.requestType === 'expense' && (
                                    <div className="space-y-2 text-sm text-gray-700"><p><b>Desc:</b> {selectedRequest.expenseDetails.description}</p><p><b>Amount:</b> ${selectedRequest.expenseDetails.amount}</p></div>
                                )}
                                {selectedRequest.requestType === 'travel' && (
                                    <div className="space-y-2 text-sm text-gray-700"><p><b>Destination:</b> {selectedRequest.travelDetails?.destination.city}</p><p><b>Est. Total:</b> ${selectedRequest.travelDetails?.estimatedExpenses.total}</p><p><b>Dates:</b> {formatDate(selectedRequest.travelDetails?.departureDate)} to {formatDate(selectedRequest.travelDetails?.returnDate)}</p></div>
                                )}
                                {selectedRequest.requestType === 'wfh' && (
                                    <div className="space-y-2 text-sm text-gray-700"><p><b>Dates:</b> {formatDate(selectedRequest.wfhDetails?.fromDate)} to {formatDate(selectedRequest.wfhDetails?.toDate)}</p><p><b>Type:</b> {selectedRequest.wfhDetails?.wfhType}</p><p><b>Reason:</b> {selectedRequest.wfhDetails?.detailedReason}</p></div>
                                )}
                                {selectedRequest.requestType === 'training' && (
                                    <div className="space-y-2 text-sm text-gray-700"><p><b>Course:</b> {selectedRequest.trainingDetails?.courseName}</p><p><b>Provider:</b> {selectedRequest.trainingDetails?.provider}</p><p><b>Total Cost:</b> ${selectedRequest.trainingDetails?.totalCost}</p></div>
                                )}
                                {selectedRequest.requestType === 'shift' && (
                                    <div className="space-y-2 text-sm text-gray-700"><p><b>Target Shift:</b> {selectedRequest.shiftDetails?.requestedShift.shiftType} ({selectedRequest.shiftDetails?.requestedShift.startTime}-{selectedRequest.shiftDetails?.requestedShift.endTime})</p><p><b>Duration:</b> {selectedRequest.shiftDetails?.changeType}</p><p><b>Reason:</b> {selectedRequest.shiftDetails?.detailedReason}</p></div>
                                )}
                            </div>

                            {/* DOCUMENT RENDERER */}
                            {['purchase', 'travel', 'training', 'shift'].includes(selectedRequest.requestType) && selectedRequest[`${selectedRequest.requestType}Details`]?.documentUrl && (
                                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 mt-4 rounded-lg border border-gray-200 dark:border-slate-700">
                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                                        Attached PDF Document
                                    </span>
                                    <a href={selectedRequest[`${selectedRequest.requestType}Details`].documentUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold hover:underline">View File</a>
                                </div>
                            )}
                            
                            {selectedRequest.requestType === 'expense' && selectedRequest.expenseDetails?.receiptUrl && (
                                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 mt-4 rounded-lg border border-gray-200 dark:border-slate-700">
                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                        Attached Receipt
                                    </span>
                                    <a href={selectedRequest.expenseDetails.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold hover:underline">View Receipt</a>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Team Lead Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#eef2f6] dark:bg-slate-800 border border-gray-300 dark:border-slate-600 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm"
                                placeholder="Provide feedback or reasoning..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                                Signature PIN <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={signaturePin}
                                onChange={(e) => setSignaturePin(e.target.value)}
                                className="w-full px-4 py-3 bg-[#eef2f6] dark:bg-slate-800 border border-gray-300 dark:border-slate-600 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                placeholder="Enter your secret PIN to sign"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleApproval('approve')}
                                disabled={processing}
                                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-bold shadow-sm hover:shadow-lg transition-all flex justify-center items-center"
                            >
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Approve
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleApproval('reject')}
                                disabled={processing}
                                className="w-full bg-[#eef2f6] dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-900/50 py-3 px-4 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-50 font-bold shadow-sm hover:shadow-lg transition-all flex justify-center items-center"
                            >
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        Reject
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default TeamLeadDashboard;
