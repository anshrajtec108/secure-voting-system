import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { makePostRequest } from '../../services/api';

const OtpVerify = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    const { voterId } = state || 'rithik@mehta658';
    const navigate = useNavigate();

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await makePostRequest(`/user/login/otp`,{}, { voterId, otp, region: '' },{});
            if (response) {
                // Success logic, perhaps store token, or navigate to dashboard
                console.log(response);
                
                localStorage.setItem('accessToken', response.data.token ||response.token)
                alert('Login successful!');
                navigate('/dashboard'); // Example route
            }
        } catch (error) {
            setError('Invalid OTP or verification failed.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Verify OTP</h2>
                <form onSubmit={handleOtpVerification} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
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
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerify;
