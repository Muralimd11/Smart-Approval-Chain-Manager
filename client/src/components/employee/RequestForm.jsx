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
