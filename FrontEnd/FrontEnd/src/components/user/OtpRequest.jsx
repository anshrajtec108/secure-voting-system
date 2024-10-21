import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { makePostRequest } from '../../services/api';

const OtpRequest = () => {
    const [voterId, setVoterId] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOtpRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await makePostRequest(`/user/login/generate-otp`,{}, { voterId, phoneNo },{});
            console.log(response);
            
                navigate('/otp-verify', { state: { voterId } });
            
        } catch (error) {
            setError('Failed to send OTP. Please check your details.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Generate OTP</h2>
                <form onSubmit={handleOtpRequest} className="space-y-4">
                    <div>
                        <label htmlFor="voterId" className="block text-sm font-medium text-gray-700">
                            Voter ID
                        </label>
                        <input
                            type="text"
                            id="voterId"
                            value={voterId}
                            onChange={(e) => setVoterId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phoneNo"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className={`w-full bg-indigo-600 text-white py-2 rounded-md font-bold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpRequest;
