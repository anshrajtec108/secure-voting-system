import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVoteYea } from 'react-icons/fa';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleVote = () => {
        const voteWindow = window.open('/vote', '_blank', 'width=800,height=600');

        // Set timeout for 10 minutes (600,000 ms)
        setTimeout(() => {
            voteWindow.close();
            alert('Your voting session has expired. Please vote again.');
            navigate('/dashboard');
        }, 600000);
    };
    const handleLogout = async () => {
      
        localStorage.removeItem('accessToken');
        navigate('/');
        

    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard</h1>
                <p className="text-gray-600 mb-6">
                    You have <span className="font-bold">10 minutes</span> to vote after clicking the button below.
                </p>

                <button
                    onClick={handleVote}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg transition duration-300 ease-in-out shadow-md"
                >
                    <FaVoteYea className="mr-2 text-2xl" />
                    Vote Now
                </button>

                <p className="text-sm text-gray-500 mt-4">
                    Make sure to submit your vote within the allocated time!
                </p>
            </div>
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
                Logout
            </button>
            <footer className="mt-8 text-gray-500">
                © 2024 Voting App. All Rights Reserved.
            </footer>
        </div>
    );
};

export default Dashboard;

