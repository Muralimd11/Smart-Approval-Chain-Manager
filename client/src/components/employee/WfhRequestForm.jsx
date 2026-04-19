import React, { useState } from 'react';
import { requestService } from '../../services/requestService';

const WfhRequestForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        wfhType: 'Full Day',
        frequency: 'One-time',
        reasonCategory: 'Focus Work',
        detailedReason: '',
        tasksPlanned: '',
        availableFrom: '09:00',
        availableTo: '18:00',
        contactNumber: '',
        emergencyContact: '',
        hasRequiredEquipment: true,
        internetSpeed: '',
        scheduledMeetings: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const timeOptions = [
        "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 AM",
        "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM",
        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
        "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
    ];

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const validateForm = () => {
        if (formData.detailedReason.length < 30) {
            setError('Detailed explanation must be at least 30 characters.');
            return false;
        }

        const taskLines = formData.tasksPlanned.split('\n').filter(line => line.trim().length > 0);
        if (taskLines.length < 2) {
            setError('Please list at least 2 planned tasks on separate lines.');
            return false;
        }

        if (!formData.contactNumber || formData.contactNumber.length < 5) {
            setError('Must provide valid contact number.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        const fDate = new Date(formData.fromDate);
        const tDate = new Date(formData.toDate);
        const totalDays = Math.ceil((tDate - fDate) / (1000 * 60 * 60 * 24)) + 1;

        const wfhDetails = {
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            totalDays,
            wfhType: formData.wfhType,
            frequency: formData.frequency,
            reasonCategory: formData.reasonCategory,
            detailedReason: formData.detailedReason,
            tasksPlanned: formData.tasksPlanned, // Saving as exact string block
            availableHours: {
                from: formData.availableFrom,
                to: formData.availableTo
            },
            contactNumber: formData.contactNumber,
            emergencyContact: formData.emergencyContact,
            hasRequiredEquipment: formData.hasRequiredEquipment,
            internetSpeed: formData.internetSpeed,
            scheduledMeetings: formData.scheduledMeetings
        };

        const submitData = new FormData();
        submitData.append('requestType', 'wfh');
        submitData.append('wfhDetails', JSON.stringify(wfhDetails));

        try {
            const response = await requestService.createRequest(submitData);
            if (response.success) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit WFH request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-sm text-center">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">From Date</label>
                    <input type="date" name="fromDate" required value={formData.fromDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">To Date</label>
                    <input type="date" name="toDate" required value={formData.toDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">WFH Type</label>
                    <select name="wfhType" value={formData.wfhType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day (Morning)">Half Day (Morning)</option>
                        <option value="Half Day (Afternoon)">Half Day (Afternoon)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Frequency</label>
                    <select name="frequency" value={formData.frequency} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                        <option value="One-time">One-time</option>
                        <option value="Recurring (weekly)">Recurring (weekly)</option>
                        <option value="Recurring (monthly)">Recurring (monthly)</option>
                    </select>
                </div>
            </div>

            <div className="space-y-6 pt-2">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reason Category</label>
                    <select name="reasonCategory" value={formData.reasonCategory} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                        <option value="Focus Work">Focus Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Medical">Medical</option>
                        <option value="Family Emergency">Family Emergency</option>
                        <option value="Weather">Weather Condition</option>
                        <option value="Commute Issues">Commute Issues</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Reason</label>
                    <textarea name="detailedReason" required minLength="30" value={formData.detailedReason} onChange={handleChange} rows="3" placeholder="Provide sufficient background for this request..." className={`w-full px-4 py-3 bg-white border rounded-xl text-sm ${formData.detailedReason.length > 0 && formData.detailedReason.length < 30 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}`}></textarea>
                    {formData.detailedReason.length > 0 && formData.detailedReason.length < 30 && (
                        <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center">
                           <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                           Minimum 30 characters required. Current: {formData.detailedReason.length}/30
                        </p>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Planned Tasks (Required, Min 2)</label>
                    <p className="text-xs text-gray-500 mb-2">Please list each task on a new line.</p>
                    <textarea name="tasksPlanned" required value={formData.tasksPlanned} onChange={handleChange} rows="4" placeholder="- Complete Q3 review document&#10;- Deploy patch for staging environment" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"></textarea>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-700 mb-1 tracking-widest uppercase">Available From (IST)</label>
                        <select name="availableFrom" required value={formData.availableFrom} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm">
                            <option value="">Select Time...</option>
                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-700 mb-1 tracking-widest uppercase">Available To (IST)</label>
                        <select name="availableTo" required value={formData.availableTo} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm">
                            <option value="">Select Time...</option>
                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                    <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Internet Speed (Optional)</label>
                    <input type="text" name="internetSpeed" value={formData.internetSpeed} onChange={handleChange} placeholder="e.g. 100 Mbps" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" name="hasRequiredEquipment" checked={formData.hasRequiredEquipment} onChange={handleChange} id="equipmentCheck" className="w-4 h-4 text-indigo-600 rounded" />
                <label htmlFor="equipmentCheck" className="text-sm font-bold text-gray-700">I have required equipment (Laptop, Internet, Access) for operations.</label>
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

export default WfhRequestForm;
