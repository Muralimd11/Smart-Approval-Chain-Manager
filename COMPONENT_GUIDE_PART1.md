# REMAINING REACT COMPONENTS IMPLEMENTATION GUIDE

This file contains all the remaining React components that need to be created.
Copy each section into its respective file path.

## NOTIFICATION COMPONENTS

### File: client/src/components/notifications/NotificationBell.jsx
```jsx
import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <NotificationPanel onClose={() => setShowPanel(false)} />
      )}
    </div>
  );
};

export default NotificationBell;
```

### File: client/src/components/notifications/NotificationPanel.jsx
```jsx
import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationPanel = ({ onClose }) => {
  const { notifications, markAllAsRead } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 max-h-96 overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Mark all read
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
```

### File: client/src/components/notifications/NotificationItem.jsx
```jsx
import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDateTime } from '../../utils/helpers';

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 hover:bg-gray-50 cursor-pointer ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
    >
      <p className="text-sm text-gray-900">{notification.message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {formatDateTime(notification.createdAt)}
      </p>
      {!notification.isRead && (
        <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
          New
        </span>
      )}
    </div>
  );
};

export default NotificationItem;
```

## EMPLOYEE COMPONENTS

### File: client/src/components/employee/RequestForm.jsx
```jsx
import React, { useState } from 'react';
import PurchaseRequestForm from './PurchaseRequestForm';
import ExpenseReimbursementForm from './ExpenseReimbursementForm';
import LeaveRequestForm from './LeaveRequestForm';

const RequestForm = ({ onSuccess }) => {
  const [requestType, setRequestType] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Request</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Request Type
        </label>
        <select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">-- Select Type --</option>
          <option value="purchase">Purchase Request</option>
          <option value="expense">Expense Reimbursement</option>
          <option value="leave">Leave Request</option>
        </select>
      </div>

      {requestType === 'purchase' && <PurchaseRequestForm onSuccess={onSuccess} />}
      {requestType === 'expense' && <ExpenseReimbursementForm onSuccess={onSuccess} />}
      {requestType === 'leave' && <LeaveRequestForm onSuccess={onSuccess} />}
    </div>
  );
};

export default RequestForm;
```

### File: client/src/components/employee/PurchaseRequestForm.jsx
```jsx
import React, { useState } from 'react';
import { requestService } from '../../services/requestService';
import toast from 'react-hot-toast';

const PurchaseRequestForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    productName: '',
    marketPrice: '',
    reason: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please upload a PDF document');
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('requestType', 'purchase');
    data.append('productName', formData.productName);
    data.append('marketPrice', formData.marketPrice);
    data.append('reason', formData.reason);
    data.append('file', file);

    try {
      await requestService.createRequest(data);
      toast.success('Purchase request submitted successfully!');
      setFormData({ productName: '', marketPrice: '', reason: '' });
      setFile(null);
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
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Market Price</label>
        <input
          type="number"
          name="marketPrice"
          value={formData.marketPrice}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason for Purchase</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload PDF Document</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Purchase Request'}
      </button>
    </form>
  );
};

export default PurchaseRequestForm;
```

Continue in next file...
