import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function ProtectedRoute({ Component }) {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')// Check both localStorage and cookies
        if (!accessToken) {
            console.log('Please login');
            navigate('/');
        }
    }, [navigate]); // Dependency array should include navigate to avoid warnings

    return (
        <div>
            <Component />
        </div>
    );
}

export default ProtectedRoute;
