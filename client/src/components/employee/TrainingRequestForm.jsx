import React, { useState } from 'react';
import { requestService } from '../../services/requestService';

const TrainingRequestForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        courseName: '',
        provider: '',
        courseType: 'Online',
        startDate: '',
        endDate: '',
        totalDuration: '',
        classSchedule: 'Self-paced',
        hoursPerWeek: '',
        courseFee: '',
        examFee: '',
        materialsCost: '',
        travelCost: '',
        relevanceToRole: '',
        skillsToGain: '',
        careerGoals: '',
        benefitToCompany: '',
        applicableProjects: '',
        completionCommitment: '',
        postTrainingService: '',
        certificationIncluded: false,
        certificationValidity: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF document for the syllabus or brochure.');
            setFile(null);
            return;
        }
        setError('');
        setFile(selectedFile);
    };

    const validateForm = () => {
        if (!file) {
            setError('Brochure/Syllabus PDF is required.');
            return false;
        }
        
        if (formData.relevanceToRole.length < 100) {
            setError('Please explain relevance to current role in detail (minimum 100 characters).');
            return false;
        }

        if (formData.benefitToCompany.length < 100) {
            setError('Please describe company benefits in detail (minimum 100 characters).');
            return false;
        }

        const costTotal = (Number(formData.courseFee) || 0) + (Number(formData.examFee) || 0) + (Number(formData.materialsCost) || 0) + (Number(formData.travelCost) || 0);

        if (costTotal > 1000 && (!formData.postTrainingService || formData.postTrainingService.length < 10)) {
            setError('Courses over $1000 require a post-training retention policy agreement statement.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        const totalCostCalc = (Number(formData.courseFee) || 0) + (Number(formData.examFee) || 0) + (Number(formData.materialsCost) || 0) + (Number(formData.travelCost) || 0);

        const trainingDetails = {
            ...formData,
            courseFee: Number(formData.courseFee) || 0,
            examFee: Number(formData.examFee) || 0,
            materialsCost: Number(formData.materialsCost) || 0,
            travelCost: Number(formData.travelCost) || 0,
            hoursPerWeek: Number(formData.hoursPerWeek) || 0,
            totalCost: totalCostCalc
        };

        const submitData = new FormData();
        submitData.append('requestType', 'training');
        submitData.append('trainingDetails', JSON.stringify(trainingDetails));
        if (file) submitData.append('document', file);

        try {
            const response = await requestService.createRequest(submitData);
            if (response.success) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit Training Request.');
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
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Course Name</label>
                    <input type="text" name="courseName" required value={formData.courseName} onChange={handleChange} placeholder="e.g. AWS Certified Solutions Architect" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Provider</label>
                     <input type="text" name="provider" required value={formData.provider} onChange={handleChange} placeholder="e.g. Coursera, Udemy" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Delivery Type</label>
                    <select name="courseType" value={formData.courseType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                        <option value="Online">Online</option>
                        <option value="In-person">In-person</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                    <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">End Date (Target)</label>
                    <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
            </div>

             <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div>
                         <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Funding Breakdowns ($)</h4>
                  </div>
                 <div><input type="number" name="courseFee" value={formData.courseFee} onChange={handleChange} placeholder="Tuition/Course Fee" className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
                 <div><input type="number" name="examFee" value={formData.examFee} onChange={handleChange} placeholder="Exam/Cert Fee" className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
                 <div><input type="number" name="materialsCost" value={formData.materialsCost} onChange={handleChange} placeholder="Books/Materials" className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Relevance to Current Role (Min 100 Chars)</label>
                    <textarea name="relevanceToRole" required value={formData.relevanceToRole} onChange={handleChange} rows="3" placeholder="Explain how the course maps directly to your existing responsibilities..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"></textarea>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Benefit to Company/ROI (Min 100 Chars)</label>
                    <textarea name="benefitToCompany" required value={formData.benefitToCompany} onChange={handleChange} rows="3" placeholder="Describe how completing this course improves business outcomes or team efficiency..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"></textarea>
                </div>
                <div className="mt-4">
                     <label className="block text-sm font-bold text-gray-700 mb-2">Post-Training Retention Agreement</label>
                     <input type="text" name="postTrainingService" value={formData.postTrainingService} onChange={handleChange} placeholder="e.g. Agree to serve 1yr post-completion (Mandatory > $1000)" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Attach Syllabus or Brochure (Required)
                </label>
                <input
                    type="file"
                    accept=".pdf"
                    required
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

export default TrainingRequestForm;
