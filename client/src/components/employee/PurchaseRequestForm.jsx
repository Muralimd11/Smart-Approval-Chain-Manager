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
