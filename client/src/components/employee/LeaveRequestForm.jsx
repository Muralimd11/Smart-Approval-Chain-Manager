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
