import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import RequestForm from '../components/employee/RequestForm';
import { requestService } from '../services/requestService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, getStatusColor } from '../utils/helpers';
import { REQUEST_TYPE_LABELS, STATUS_LABELS } from '../utils/constants';
import { SocketContext } from '../context/SocketContext';

const EmployeeDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    };

    const getColumnRequests = (status) => {
        if (status === 'pending') {
            return requests.filter(r => r.status === 'pending' || r.status === 'approved_by_teamlead');
        }
        return requests.filter(r => r.status === status);
    };

    const RequestCard = ({ request }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition mb-4">
            <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-800">{REQUEST_TYPE_LABELS[request.requestType]}</span>
                <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
            </div>

            <div className="mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {STATUS_LABELS[request.status]}
                </span>
            </div>

            {request.requestType === 'leave' && (
                <div className="text-sm text-gray-600 space-y-1">
                    <p>From: {formatDate(request.leaveDetails.fromDate)}</p>
                    <p>To: {formatDate(request.leaveDetails.toDate)}</p>
                    <p>Days: {request.leaveDetails.numberOfDays}</p>
                </div>
            )}

            {request.requestType === 'purchase' && (
                <div className="text-sm text-gray-600 space-y-1">
                    <p>{request.purchaseDetails.productName}</p>
                    <p>${request.purchaseDetails.marketPrice}</p>
                </div>
            )}

            {request.requestType === 'expense' && (
                <div className="text-sm text-gray-600 space-y-1">
                    <p>${request.expenseDetails.amount}</p>
                </div>
            )}

            {(request.teamLeadApproval?.comment || request.managerApproval?.comment || request.rejectionReason) && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                    {request.teamLeadApproval?.comment && (
                        <p className="text-xs text-gray-500 mt-1"><span className="font-medium">TL:</span> {request.teamLeadApproval.comment}</p>
                    )}
                    {request.managerApproval?.comment && (
                        <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Mgr:</span> {request.managerApproval.comment}</p>
                    )}
                    {request.rejectionReason && (
                        <p className="text-xs text-red-500 mt-1"><span className="font-medium">Reason:</span> {request.rejectionReason}</p>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
                    <p className="mt-2 text-gray-600">Submit and track your requests</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <RequestForm onSuccess={handleSuccess} />
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Approved Column */}
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Approved
                                        <span className="ml-2 bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                            {getColumnRequests('approved').length}
                                        </span>
                                    </h3>
                                    <div className="space-y-4">
                                        {getColumnRequests('approved').map(req => (
                                            <RequestCard key={req._id} request={req} />
                                        ))}
                                        {getColumnRequests('approved').length === 0 && (
                                            <p className="text-center text-gray-400 text-sm italic">No approved requests</p>
                                        )}
                                    </div>
                                </div>

                                {/* Pending Column */}
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <h3 className="text-lg font-bold text-yellow-700 mb-4 flex items-center">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                        Pending
                                        <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                                            {getColumnRequests('pending').length}
                                        </span>
                                    </h3>
                                    <div className="space-y-4">
                                        {getColumnRequests('pending').map(req => (
                                            <RequestCard key={req._id} request={req} />
                                        ))}
                                        {getColumnRequests('pending').length === 0 && (
                                            <p className="text-center text-gray-400 text-sm italic">No pending requests</p>
                                        )}
                                    </div>
                                </div>

                                {/* Rejected Column */}
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                        Rejected
                                        <span className="ml-2 bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                            {getColumnRequests('rejected').length}
                                        </span>
                                    </h3>
                                    <div className="space-y-4">
                                        {getColumnRequests('rejected').map(req => (
                                            <RequestCard key={req._id} request={req} />
                                        ))}
                                        {getColumnRequests('rejected').length === 0 && (
                                            <p className="text-center text-gray-400 text-sm italic">No rejected requests</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
