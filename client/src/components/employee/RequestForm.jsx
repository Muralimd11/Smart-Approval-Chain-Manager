import React, { useState } from 'react';
import PurchaseRequestForm from './PurchaseRequestForm';
import ExpenseReimbursementForm from './ExpenseReimbursementForm';
import LeaveRequestForm from './LeaveRequestForm';

const RequestForm = ({ onSuccess }) => {
    const [requestType, setRequestType] = useState('');

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </span>
                Create New Request
            </h2>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Request Type
                </label>
                <div className="relative">
                    <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer text-gray-700 font-medium"
                    >
                        <option value="">Select a type...</option>
                        <option value="purchase">Purchase Request</option>
                        <option value="expense">Expense Reimbursement</option>
                        <option value="leave">Leave Request</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {requestType === 'purchase' && <PurchaseRequestForm onSuccess={onSuccess} />}
                {requestType === 'expense' && <ExpenseReimbursementForm onSuccess={onSuccess} />}
                {requestType === 'leave' && <LeaveRequestForm onSuccess={onSuccess} />}

                {!requestType && (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm">Select a request type above to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestForm;
