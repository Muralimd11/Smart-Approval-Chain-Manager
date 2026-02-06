import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">403</h1>
                <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
                <Link
                    to="/login"
                    className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
