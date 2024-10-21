// src/services/errorHandler.js
import { useNavigate } from 'react-router-dom';

export const handleErrors = (error) => {
 
    const status = error?.response?.status;

    switch (status) {
        case 400:
            console.error('Bad Request:', error.message);
            break;
        case 401:
            alert('/access-denied')
            console.error('Unauthorized:', error.message);
            // Add logic to handle token refresh or redirect to login
            break;
        case 403:
            alert('Access Denied: Unauthorized domain OR IP address')
            break;
        case 404:
            alert('/not-found')
            console.error('Not Found:', error.message);
            break;
        case 500:
            alert('/server-error')
            console.error('Internal Server Error:', error.message);
            break;
        case 429:
            alert('Too Many Requests')
            console.error('Internal Server Error:', error.message);
            break;
        default:
            console.error('An unknown error occurred:', error);
    }

    // Optionally throw the error to allow further handling
    throw error;
};
