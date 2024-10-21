// src/services/apiService.js
import axios from 'axios';
import { handleErrors } from './errorHandler';

const BASE_URL = import.meta.env.VITE_BASE_URL;




const getAuthToken = () => {
    const token = localStorage.getItem('accessToken') || "not a token ";
    console.log('token', token);
    return token;
};



export const makeGetRequest = async (url, queryParams = {}, headers = {}) => {
    try {
        
        const response = await axios.get(`${BASE_URL}${url}`, {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                ...headers,
            },
        });
        return response.data;
    } catch (error) {
        console.log("error in get data", error);

        handleErrors(error);
    }
};

export const makePostRequest = async (url, queryParams, body, headers = {}) => {
    try {
        console.log('i am post router');
        
        const response = await axios.post(
            `${BASE_URL}${url}`,
            body,
            {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                    ...headers,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};



export const makePutRequest = async (url, queryParams, body, headers = {}) => {
    try {
        const response = await axios.put(
            `${BASE_URL}${url}`,
            body,
            {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                    ...headers,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};

export const makeDeleteRequest = async (url, queryParams, headers = {}) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}${url}`,
            {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    ...headers,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};
