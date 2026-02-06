# COMPONENT GUIDE PART 2 - Pages and Remaining Components

## PAGES

### File: client/src/pages/EmployeeDashboard.jsx
```jsx
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
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {STATUS_LABELS[request.status]}
                        </span>
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
```

### File: client/src/pages/TeamLeadDashboard.jsx
```jsx
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
```

### File: client/src/pages/ManagerDashboard.jsx
```jsx
// Similar to TeamLeadDashboard but uses approvalService.managerApproval
// Copy TeamLeadDashboard and replace:
// - approvalService.teamLeadApproval with approvalService.managerApproval
// - Title: "Manager Dashboard"
// - Description: "Final approval of requests"
```

### File: client/src/pages/NotFound.jsx
```jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page not found</p>
        <Link
          to="/login"
          className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
```

### File: client/src/pages/Unauthorized.jsx
```jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
        <Link
          to="/login"
          className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
```

## MISSING EXPENSE AND LEAVE FORMS

### File: client/src/components/employee/ExpenseReimbursementForm.jsx
```jsx
// Similar to PurchaseRequestForm
// Fields: amount, description, file upload
// Use requestType: 'expense'
```

### File: client/src/components/employee/LeaveRequestForm.jsx
```jsx
import React, { useState } from 'react';
import { requestService } from '../../services/requestService';
import toast from 'react-hot-toast';

const LeaveRequestForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('requestType', 'leave');
    data.append('fromDate', formData.fromDate);
    data.append('toDate', formData.toDate);
    data.append('reason', formData.reason);

    try {
      await requestService.createRequest(data);
      toast.success('Leave request submitted successfully!');
      setFormData({ fromDate: '', toDate: '', reason: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">From Date</label>
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">To Date</label>
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason for Leave</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Leave Request'}
      </button>
    </form>
  );
};

export default LeaveRequestForm;
```
