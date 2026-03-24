import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import { requestService } from '../services/requestService';
import { approvalService } from '../services/approvalService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/helpers';
import { REQUEST_TYPE_LABELS } from '../utils/constants';
import toast from 'react-hot-toast';
import { SocketContext } from '../context/SocketContext';

const ManagerDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [comment, setComment] = useState('');
    const [signaturePin, setSignaturePin] = useState('');
    const [processing, setProcessing] = useState(false);
    const { socket } = useContext(SocketContext);

    const renderCertificate = (approval, title) => {
        if (!approval || !approval.signature) return null;
        return (
            <div className="mt-3 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/30 rounded-lg p-3 text-xs font-mono mb-3">
                <div className="flex items-center text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    {title} Digital Certificate
                </div>
                <div className="grid grid-cols-1 gap-1 text-gray-600 dark:text-slate-400">
                    <div className="break-all"><span className="text-gray-400 dark:text-slate-500 select-none">Signature:</span> {approval.signature}</div>
                    <div><span className="text-gray-400 dark:text-slate-500 select-none">Timestamp:</span> {formatDate(approval.approvedAt)}</div>
                    <div className="flex justify-between">
                        <span><span className="text-gray-400 dark:text-slate-500 select-none">IP:</span> {approval.ipAddress}</span>
                        <span className="truncate ml-4 max-w-[200px]" title={approval.userAgent}><span className="text-gray-400 dark:text-slate-500 select-none">Client:</span> {approval.userAgent?.split(' ')[0]}</span>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('notification', () => {
                fetchRequests();
            });
            return () => socket.off('notification');
        }
    }, [socket]);

    const fetchRequests = async () => {
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
    };

    const handleApproval = async (action) => {
        if (!signaturePin || signaturePin.length < 4) {
            toast.error("Please enter your 4+ character Signature PIN.");
            return;
        }
        setProcessing(true);
        try {
            await approvalService.managerApproval(selectedRequest._id, action, comment, signaturePin);
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

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'approved_by_teamlead':
                return <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/30">TL Approved</span>;
            case 'pending':
                return <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">Pending</span>;
            default:
                return <span className="bg-gray-100 dark:bg-slate-700/50 text-gray-800 dark:text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-gray-200 dark:border-slate-600">{status}</span>;
        }
    };

    const RequestCard = ({ request }) => (
        <div className="glass-card rounded-2xl p-6 group relative animate-fade-in-up">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <span className={`p-2.5 rounded-lg ${request.requestType === 'purchase' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                            request.requestType === 'leave' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                                'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                        {request.requestType === 'purchase' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>}
                        {request.requestType === 'leave' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                        {request.requestType === 'expense' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    </span>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">{REQUEST_TYPE_LABELS[request.requestType]}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Submitted by <span className="text-indigo-600 dark:text-indigo-400">{request.employee?.name}</span></p>
                    </div>
                </div>
                <StatusBadge status={request.status} />
            </div>

            <div className="bg-[#eef2f6]/80 dark:bg-slate-700/30 rounded-lg p-4 mb-4 border border-gray-100 dark:border-slate-700/50">
                {request.requestType === 'leave' && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">From</p><p className="font-medium text-gray-800 dark:text-slate-200">{formatDate(request.leaveDetails.fromDate)}</p></div>
                        <div><p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">To</p><p className="font-medium text-gray-800 dark:text-slate-200">{formatDate(request.leaveDetails.toDate)}</p></div>
                        <div className="col-span-2 border-t border-gray-200 dark:border-slate-700/50 pt-2 mt-2"><p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Reason</p><p className="font-medium text-gray-800 dark:text-slate-200">{request.leaveDetails.reason}</p></div>
                    </div>
                )}
                {request.requestType === 'purchase' && (
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <div><p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Product</p><p className="font-medium text-gray-800 dark:text-slate-200">{request.purchaseDetails.productName}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Price</p><p className="font-medium text-gray-800 dark:text-slate-200">${request.purchaseDetails.marketPrice}</p></div>
                        </div>
                        <div><p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Reason</p><p className="font-medium text-gray-800 dark:text-slate-200">{request.purchaseDetails.reason}</p></div>
                    </div>
                )}
                {request.requestType === 'expense' && (
                    <div className="space-y-3 text-sm">
                        <div className="border-b border-gray-200 dark:border-slate-700/50 pb-2">
                            <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Amount</p><p className="font-medium text-gray-800 dark:text-slate-200 text-lg">${request.expenseDetails.amount}</p>
                        </div>
                        <div><p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Description</p><p className="font-medium text-gray-800 dark:text-slate-200">{request.expenseDetails.description}</p></div>
                    </div>
                )}
            </div>

            <div className="flex justify-end items-center pt-2">
                <span className="text-xs text-gray-400 mr-auto font-medium">{formatDate(request.createdAt)}</span>
                <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <span className="font-bold text-sm">Final Approval</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manager Dashboard</h1>
                        <p className="mt-2 text-gray-500 dark:text-slate-400 font-medium">Finalize and approve requests</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="glass-card rounded-2xl px-6 py-3 flex items-center animate-fade-in-up">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mr-3 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <span className="text-sm font-bold text-slate-700 dark:text-white">{requests.length} Pending Actions</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                title="Final Review"
            >
                {selectedRequest && (
                    <div className="space-y-6">
                        <div className="bg-[#eef2f6] dark:bg-slate-700/30 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedRequest.requestType === 'purchase' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300' :
                                        selectedRequest.requestType === 'leave' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300' :
                                            'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                    }`}>
                                    {REQUEST_TYPE_LABELS[selectedRequest.requestType]}
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedRequest.employee?.name}</span>
                            </div>

                            {(selectedRequest.teamLeadApproval?.comment || selectedRequest.teamLeadApproval?.signature) && (
                                <div>
                                    {selectedRequest.teamLeadApproval?.comment && (
                                        <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30 mb-2">
                                            <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide mb-1">Team Lead Feedback</p>
                                            <p className="text-sm text-blue-900 dark:text-blue-300">{selectedRequest.teamLeadApproval.comment}</p>
                                            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Approved by {selectedRequest.teamLeadApproval.approvedBy?.name}</p>
                                        </div>
                                    )}
                                    {renderCertificate(selectedRequest.teamLeadApproval, "Team Lead")}
                                </div>
                            )}

                            {selectedRequest.requestType === 'purchase' && selectedRequest.purchaseDetails?.documentUrl && (
                                <div className="flex items-center justify-between bg-[#eef2f6] dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 mt-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                                        Attached PDF
                                    </span>
                                    <a href={selectedRequest.purchaseDetails.documentUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold hover:underline">View Document</a>
                                </div>
                            )}
                            {selectedRequest.requestType === 'expense' && selectedRequest.expenseDetails?.receiptUrl && (
                                <div className="flex items-center justify-between bg-[#eef2f6] dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 mt-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-300 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                        Receipt
                                    </span>
                                    <a href={selectedRequest.expenseDetails.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold hover:underline">View Receipt</a>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Manager Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#eef2f6] dark:bg-slate-800 border border-gray-300 dark:border-slate-600 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm"
                                placeholder="Final approval notes..."
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
                                        Final Approve
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
        </div>
    );
};

export default ManagerDashboard;
