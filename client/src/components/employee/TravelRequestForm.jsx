import React, { useState } from 'react';
import { requestService } from '../../services/requestService';

const TravelRequestForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        travelPurpose: '',
        destinationCity: '',
        destinationState: '',
        destinationCountry: '',
        departureDate: '',
        returnDate: '',
        travelMode: 'Flight',
        accommodationRequired: false,
        hotelBudget: '',
        estTransportation: '',
        estAccommodation: '',
        estMeals: '',
        estMiscellaneous: '',
        clientName: '',
        projectCode: '',
        advanceRequired: false,
        advanceAmount: ''
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
            setError('Please upload a PDF document for itineraries/estimates.');
            setFile(null);
            return;
        }
        setError('');
        setFile(selectedFile);
    };

    const validateForm = () => {
        const depDate = new Date(formData.departureDate);
        const retDate = new Date(formData.returnDate);
        const now = new Date();
        const diffDays = Math.ceil((depDate - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 3) {
            setError('Departure date must be at least 3 days in the future.');
            return false;
        }
        if (retDate <= depDate) {
            setError('Return date must be after departure date.');
            return false;
        }
        
        const totalCost = (Number(formData.estTransportation) || 0) + (Number(formData.estAccommodation) || 0) + (Number(formData.estMeals) || 0) + (Number(formData.estMiscellaneous) || 0);

        if (totalCost > 10000) {
            setError('Estimated costs exceed the maximum standard limit of $10000.');
            return false;
        }

        if (formData.advanceRequired && Number(formData.advanceAmount) > (totalCost * 0.8)) {
            setError('Advance cannot exceed 80% of total estimated cost.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        const depDate = new Date(formData.departureDate);
        const retDate = new Date(formData.returnDate);
        const totalDays = Math.ceil((retDate - depDate) / (1000 * 60 * 60 * 24));
        const totalEst = (Number(formData.estTransportation) || 0) + (Number(formData.estAccommodation) || 0) + (Number(formData.estMeals) || 0) + (Number(formData.estMiscellaneous) || 0);

        const travelDetails = {
            travelPurpose: formData.travelPurpose,
            destination: {
                city: formData.destinationCity,
                state: formData.destinationState,
                country: formData.destinationCountry
            },
            departureDate: formData.departureDate,
            returnDate: formData.returnDate,
            totalDays,
            travelMode: formData.travelMode,
            accommodationRequired: formData.accommodationRequired,
            hotelBudget: Number(formData.hotelBudget) || 0,
            estimatedExpenses: {
                transportation: Number(formData.estTransportation) || 0,
                accommodation: Number(formData.estAccommodation) || 0,
                meals: Number(formData.estMeals) || 0,
                miscellaneous: Number(formData.estMiscellaneous) || 0,
                total: totalEst
            },
            clientName: formData.clientName,
            projectCode: formData.projectCode,
            advanceRequired: formData.advanceRequired,
            advanceAmount: Number(formData.advanceAmount) || 0
        };

        const submitData = new FormData();
        submitData.append('requestType', 'travel');
        submitData.append('travelDetails', JSON.stringify(travelDetails));
        if (file) {
            submitData.append('document', file);
        }

        try {
            const response = await requestService.createRequest(submitData);
            if (response.success) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
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
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Travel Purpose</label>
                    <select
                        name="travelPurpose"
                        value={formData.travelPurpose}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                        <option value="">Select Purpose</option>
                        <option value="Client Meeting">Client Meeting</option>
                        <option value="Conference">Conference</option>
                        <option value="Training">Training</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="Strategic Retreat">Strategic Retreat</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Destination City</label>
                    <input type="text" name="destinationCity" required value={formData.destinationCity} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" placeholder="e.g. London" />
                </div>
                <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Country</label>
                     <input type="text" name="destinationCountry" required value={formData.destinationCountry} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" placeholder="e.g. UK" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Departure Date</label>
                    <input type="date" name="departureDate" required value={formData.departureDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Return Date</label>
                    <input type="date" name="returnDate" required value={formData.returnDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Travel Mode</label>
                    <select name="travelMode" value={formData.travelMode} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                        <option value="Flight">Flight</option>
                        <option value="Train">Train</option>
                        <option value="Car Rental">Car Rental</option>
                        <option value="Bus">Bus</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                    <input type="checkbox" name="accommodationRequired" checked={formData.accommodationRequired} onChange={handleChange} id="accomReq" className="w-4 h-4 text-indigo-600 rounded" />
                    <label htmlFor="accomReq" className="text-sm font-bold text-gray-700">Requires Hotel/Accommodation</label>
                </div>

                {formData.accommodationRequired && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Estimated Hotel Budget (Per Night $)</label>
                        <input type="number" name="hotelBudget" value={formData.hotelBudget} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" placeholder="e.g. 150" />
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Cost Estimations ($)</h4>
                <div className="space-y-4">
                    <div><input type="number" name="estTransportation" value={formData.estTransportation} onChange={handleChange} placeholder="Transport" className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
                    <div><input type="number" name="estAccommodation" value={formData.estAccommodation} onChange={handleChange} placeholder="Hotel" className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
                    <div><input type="number" name="estMeals" value={formData.estMeals} onChange={handleChange} placeholder="Meals" className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
                    <div><input type="number" name="estMiscellaneous" value={formData.estMiscellaneous} onChange={handleChange} placeholder="Misc" className="w-full px-3 py-2 text-sm border rounded-lg" /></div>
                </div>
            </div>

            <div className="space-y-6 pt-2">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Client Name (Optional)</label>
                    <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Project Code (Optional)</label>
                    <input type="text" name="projectCode" value={formData.projectCode} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                    <input type="checkbox" name="advanceRequired" checked={formData.advanceRequired} onChange={handleChange} id="advReq" className="w-4 h-4 text-indigo-600 rounded" />
                    <label htmlFor="advReq" className="text-sm font-bold text-gray-700">Request Cash Advance</label>
                </div>
                {formData.advanceRequired && (
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Advance Amount ($)</label>
                        <input type="number" name="advanceAmount" value={formData.advanceAmount} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" placeholder="Max 80% of total estimated cost" />
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Attach Itinerary or Supporting Document (Optional)
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

export default TravelRequestForm;
