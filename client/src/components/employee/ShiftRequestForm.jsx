import React, { useState } from 'react';
import { requestService } from '../../services/requestService';

const ShiftRequestForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        currentShiftType: 'Morning',
        currentStartTime: '09:00',
        currentEndTime: '18:00',
        targetShiftType: 'Afternoon',
        targetStartTime: '14:00',
        targetEndTime: '23:00',
        changeType: 'Temporary',
        temporaryDuration: '',
        effectiveFrom: '',
        reasonCategory: 'Personal',
        detailedReason: '',
        impactOnTeam: '',
        mitigationPlan: '',
        willingToHandover: false,
        handoverPlan: ''
    });
    const [file, setFile] = useState(null);
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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF document.');
            setFile(null);
            return;
        }
        setError('');
        setFile(selectedFile);
    };

    const validateForm = () => {
        if (formData.detailedReason.length < 50) {
            setError('Reason explanation must be at least 50 characters.');
            return false;
        }

        if (formData.reasonCategory === 'Medical' && !file) {
            setError('Medical certificate/proof required for Medical reason category.');
            return false;
        }

        if (!formData.impactOnTeam || !formData.mitigationPlan) {
            setError('You must provide Team Impact and Mitigation Analysis.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        const shiftDetails = {
            currentShift: {
                shiftType: formData.currentShiftType,
                startTime: formData.currentStartTime,
                endTime: formData.currentEndTime
            },
            requestedShift: {
                shiftType: formData.targetShiftType,
                startTime: formData.targetStartTime,
                endTime: formData.targetEndTime
            },
            changeType: formData.changeType,
            temporaryDuration: formData.changeType === 'Temporary' ? formData.temporaryDuration : 'N/A',
            effectiveFrom: formData.effectiveFrom,
            reasonCategory: formData.reasonCategory,
            detailedReason: formData.detailedReason,
            impactOnTeam: formData.impactOnTeam,
            mitigationPlan: formData.mitigationPlan,
            willingToHandover: formData.willingToHandover,
            handoverPlan: formData.handoverPlan
        };

        const submitData = new FormData();
        submitData.append('requestType', 'shift');
        submitData.append('shiftDetails', JSON.stringify(shiftDetails));
        if (file) submitData.append('document', file);

        try {
            const response = await requestService.createRequest(submitData);
            if (response.success) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit Shift Change Request.');
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
                 {/* Current Shift */}
                 <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-3">Current Roster</h4>
                      <div className="space-y-3">
                          <select name="currentShiftType" value={formData.currentShiftType} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                             <option value="Morning">Morning</option>
                             <option value="Afternoon">Afternoon</option>
                             <option value="Night">Night</option>
                          </select>
                          <div className="flex space-x-2">
                              <select name="currentStartTime" value={formData.currentStartTime} onChange={handleChange} className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                                  <option value="">Start IST</option>
                                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <select name="currentEndTime" value={formData.currentEndTime} onChange={handleChange} className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                                  <option value="">End IST</option>
                                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                          </div>
                      </div>
                 </div>

                 {/* Target Shift */}
                 <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-indigo-500 uppercase tracking-widest text-xs mb-3">Requested Roster</h4>
                      <div className="space-y-3">
                          <select name="targetShiftType" value={formData.targetShiftType} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                             <option value="Morning">Morning</option>
                             <option value="Afternoon">Afternoon</option>
                             <option value="Night">Night</option>
                             <option value="Flexible">Flexible/Rotational</option>
                          </select>
                          <div className="flex space-x-2">
                              <select name="targetStartTime" value={formData.targetStartTime} onChange={handleChange} className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                                  <option value="">Start IST</option>
                                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <select name="targetEndTime" value={formData.targetEndTime} onChange={handleChange} className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                                  <option value="">End IST</option>
                                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                          </div>
                      </div>
                 </div>
            </div>

            <div className="space-y-6 pt-2">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Change Type</label>
                    <select name="changeType" value={formData.changeType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                        <option value="Temporary">Temporary</option>
                        <option value="Permanent">Permanent</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Effective From Details</label>
                    <input type="date" name="effectiveFrom" required value={formData.effectiveFrom} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                
                {formData.changeType === 'Temporary' && (
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Temporary Duration</label>
                         <input type="text" name="temporaryDuration" value={formData.temporaryDuration} onChange={handleChange} placeholder="e.g. 1 Month, 2 Weeks" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Reason Category</label>
                     <select name="reasonCategory" value={formData.reasonCategory} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                        <option value="Personal">Personal</option>
                        <option value="Medical">Medical</option>
                        <option value="Family">Family / Childcare</option>
                        <option value="Education">Education</option>
                        <option value="Transportation">Transportation</option>
                    </select>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Reason</label>
                    <textarea name="detailedReason" required minLength="50" value={formData.detailedReason} onChange={handleChange} rows="3" placeholder="Provide sufficient background..." className={`w-full px-4 py-3 bg-white border rounded-xl text-sm ${formData.detailedReason.length > 0 && formData.detailedReason.length < 50 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}`}></textarea>
                    {formData.detailedReason.length > 0 && formData.detailedReason.length < 50 && (
                        <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center">
                           <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                           Minimum 50 characters required. Current: {formData.detailedReason.length}/50
                        </p>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                 <div className="mt-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Impact on Team</label>
                    <textarea name="impactOnTeam" required value={formData.impactOnTeam} onChange={handleChange} rows="2" placeholder="How missing your current shift affects deliverables..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"></textarea>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mitigation/Coverage Plan</label>
                    <textarea name="mitigationPlan" required value={formData.mitigationPlan} onChange={handleChange} rows="2" placeholder="How you will ensure coverage or handover..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"></textarea>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Medical/Supporting Document PDF (Required for Medical)
                </label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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

export default ShiftRequestForm;
