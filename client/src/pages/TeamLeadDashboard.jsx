import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { requestService } from '../services/requestService';
import { approvalService } from '../services/approvalService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/helpers';
import { REQUEST_TYPE_LABELS } from '../utils/constants';
import toast from 'react-hot-toast';

const TeamLeadDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

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
        setProcessing(true);
        try {
            await approvalService.teamLeadApproval(selectedRequest._id, action, comment);
            toast.success(`Request ${action}d successfully!`);
            setSelectedRequest(null);
            setComment('');
            fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Team Lead Dashboard</h1>
                    <p className="mt-2 text-gray-600">Review and approve pending requests</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Requests</h2>

                    {loading ? (
                        <LoadingSpinner />
                    ) : requests.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No pending requests</p>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div
                                    key={request._id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {REQUEST_TYPE_LABELS[request.requestType]}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                From: {request.employee?.name} | Submitted: {formatDate(request.createdAt)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRequest(request)}
                                            className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Review Request"
            >
                {selectedRequest && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Request Type</p>
                            <p className="text-gray-900">{REQUEST_TYPE_LABELS[selectedRequest.requestType]}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700">Employee</p>
                            <p className="text-gray-900">{selectedRequest.employee?.name}</p>
                        </div>

                        {selectedRequest.requestType === 'purchase' && selectedRequest.purchaseDetails?.documentUrl && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Attached Document</p>
                                <a
                                    href={selectedRequest.purchaseDetails.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 underline"
                                >
                                    View PDF
                                </a>
                            </div>
                        )}

                        {selectedRequest.requestType === 'expense' && selectedRequest.expenseDetails?.receiptUrl && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Attached Receipt</p>
                                <a
                                    href={selectedRequest.expenseDetails.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 underline"
                                >
                                    View Receipt
                                </a>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Comment (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add your comment..."
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleApproval('approve')}
                                disabled={processing}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                                onClick={() => handleApproval('reject')}
                                disabled={processing}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TeamLeadDashboard;
