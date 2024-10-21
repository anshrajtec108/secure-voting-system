import React, { useState, useEffect } from 'react';
import { makeGetRequest, makePostRequest } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const VotePage = () => {
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch parties on component mount
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await makeGetRequest('/user/parties');
                setParties(response?.data?.parties || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch parties. Please try again.');
                setLoading(false);
            }
        };

        fetchParties();
    }, []);

    const handleVote = async (partyId) => {
        try {
            await makePostRequest('/user/vote', {}, { partyId });
            alert('Thank you for your vote!');
            navigate('/dashboard'); // Navigate back to dashboard after voting
        } catch (error) {
            alert('Voting failed. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Vote for Your Party</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parties.map((party) => (
                        <div key={party.id} className="bg-white shadow-md rounded-lg p-6 text-center">
                            <img
                                src={party.symbol}
                                alt={`${party.name} Symbol`}
                                className="w-16 h-16 mx-auto mb-4"
                            />
                            <h2 className="text-xl font-bold text-gray-700 mb-2">{party.name}</h2>
                            <p className="text-gray-600 mb-4">{party.description}</p>
                            <button
                                onClick={() => handleVote(party.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            >
                                Vote for {party.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VotePage;
