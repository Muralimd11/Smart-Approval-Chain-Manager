import React, { useState } from 'react';
import { requestService } from '../../services/requestService';
import toast from 'react-hot-toast';

const ExpenseReimbursementForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        amount: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!window.confirm('Are you sure you want to submit this expense reimbursement request?')) return;

        if (!file) {
            toast.error('Please upload a receipt/document');
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('requestType', 'expense');
        data.append('amount', formData.amount);
        data.append('description', formData.description);
        data.append('file', file);

        try {
            await requestService.createRequest(data);
            toast.success('Expense reimbursement request submitted successfully!');
            setFormData({ amount: '', description: '' });
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
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Amount</label>
                <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-[#eef2f6] dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Description</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 bg-[#eef2f6] dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description of the expense"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Upload Receipt (PDF)</label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    className="mt-1 block w-full text-sm text-gray-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-600 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 mt-6"
            >
                {loading ? 'Processing...' : 'Continue'}
            </button>
        </form>
    );
};

export default ExpenseReimbursementForm;
