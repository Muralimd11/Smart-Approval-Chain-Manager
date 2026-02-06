import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import RequestForm from '../components/employee/RequestForm';
import { requestService } from '../services/requestService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, getStatusColor } from '../utils/helpers';
import { REQUEST_TYPE_LABELS, STATUS_LABELS } from '../utils/constants';

const EmployeeDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
                    <p className="mt-2 text-gray-600">Submit and track your requests</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <RequestForm onSuccess={handleSuccess} />
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Request History</h2>

                            {loading ? (
                                <LoadingSpinner />
                            ) : requests.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No requests found</p>
                            ) : (
                                <div className="space-y-4">
                                    {requests.map((request) => (
                                        <div
                                            key={request._id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {REQUEST_TYPE_LABELS[request.requestType]}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Submitted on {formatDate(request.createdAt)}
                                                    </p>
                                                </div>
                                                {request.status === 'approved_by_teamlead' ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                                            Team Lead Accepted
                                                        </span>
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                            Manager Approval Pending
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                        {STATUS_LABELS[request.status]}
                                                    </span>
                                                )}
                                            </div>

                                            {request.requestType === 'leave' && (
                                                <div className="mt-3 text-sm text-gray-700">
                                                    <p><strong>From:</strong> {formatDate(request.leaveDetails.fromDate)}</p>
                                                    <p><strong>To:</strong> {formatDate(request.leaveDetails.toDate)}</p>
                                                    <p><strong>Days:</strong> {request.leaveDetails.numberOfDays}</p>
                                                </div>
                                            )}

                                            {request.requestType === 'purchase' && (
                                                <div className="mt-3 text-sm text-gray-700">
                                                    <p><strong>Product:</strong> {request.purchaseDetails.productName}</p>
                                                    <p><strong>Price:</strong> ${request.purchaseDetails.marketPrice}</p>
                                                </div>
                                            )}

                                            {request.requestType === 'expense' && (
                                                <div className="mt-3 text-sm text-gray-700">
                                                    <p><strong>Amount:</strong> ${request.expenseDetails.amount}</p>
                                                </div>
                                            )}

                                            {/* Approval Comments Section */}
                                            {(request.teamLeadApproval?.comment || request.managerApproval?.comment) && (
                                                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                                                    {request.teamLeadApproval?.comment && (
                                                        <div className="text-sm">
                                                            <span className="font-medium text-gray-900">Team Lead Comment:</span>
                                                            <p className="text-gray-600 bg-gray-50 p-2 rounded mt-1">
                                                                {request.teamLeadApproval.comment}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {request.managerApproval?.comment && (
                                                        <div className="text-sm">
                                                            <span className="font-medium text-gray-900">Manager Comment:</span>
                                                            <p className="text-gray-600 bg-gray-50 p-2 rounded mt-1">
                                                                {request.managerApproval.comment}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
