import React, { useState } from 'react';
import PurchaseRequestForm from './PurchaseRequestForm';
import ExpenseReimbursementForm from './ExpenseReimbursementForm';
import LeaveRequestForm from './LeaveRequestForm';
import TravelRequestForm from './TravelRequestForm';
import WfhRequestForm from './WfhRequestForm';
import TrainingRequestForm from './TrainingRequestForm';
import ShiftRequestForm from './ShiftRequestForm';

const RequestForm = ({ onSuccess }) => {
    const [requestType, setRequestType] = useState('');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 overflow-y-auto max-h-[85vh] transition-colors">
            <div className="flex items-center mb-5">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">Create New Request</h2>
                    <p className="text-[10px] font-semibold text-gray-500">Submit a new approval flow</p>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-[10px] tracking-widest font-bold text-gray-900 dark:text-slate-300 mb-1.5 uppercase">
                    Request Type
                </label>
                <div className="relative">
                    <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-[#F9FAFB] dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer text-gray-900 dark:text-white font-medium text-sm"
                    >
                        <option value="" className="text-gray-500 dark:text-slate-400">Select a type</option>
                        <option value="leave">Time Off / Leave Request</option>
                        <option value="wfh">Work From Home (WFH)</option>
                        <option value="travel">Travel Authorization</option>
                        <option value="shift">Shift Modification</option>
                        <option value="purchase">Purchase Requisition</option>
                        <option value="expense">Expense Reimbursement</option>
                        <option value="training">Training Enrollment</option>
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
                {requestType === 'travel' && <TravelRequestForm onSuccess={onSuccess} />}
                {requestType === 'wfh' && <WfhRequestForm onSuccess={onSuccess} />}
                {requestType === 'training' && <TrainingRequestForm onSuccess={onSuccess} />}
                {requestType === 'shift' && <ShiftRequestForm onSuccess={onSuccess} />}

                {!requestType && (
                    <div className="flex flex-col items-center justify-center py-8 bg-[#F9FAFB]/50 rounded-xl border border-dashed border-gray-300">
                        <svg className="w-5 h-5 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p className="text-[11px] font-semibold text-gray-500">Select a request type above to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestForm;
