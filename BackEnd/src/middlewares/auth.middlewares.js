// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
import ElectionOfficer from '../models/electionOfficer.model.js';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

//user
export const authenticateTokenUser = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token
    // console.log("token", token);

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        
        req.user = await User.findByPk(decoded.id.id || decoded.id ); // Assuming the token contains user ID
        if (!req.user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        next();
    } catch (error) {
        console.log("authenticateToken  error", error);

        return res.status(400).json({ message: 'Invalid Token.' });
    }
};

//Election officer 
export const authenticateTokenElectionOfficer = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token
    // console.log("token", token);

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await ElectionOfficer.findByPk(decoded.id); // Assuming the token contains user ID
        req.user.role ='electionOfficer';
        if (!req.user) {
            return res.status(404).json({ message: 'ElectionOfficer not found.' });
        }
        next();
    } catch (error) {
        console.log("authenticateToken  error", error);

        return res.status(400).json({ message: 'Invalid Token.' });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') { // Assuming 'role' is a field in your User model
        return res.status(403).json({ message: 'Access Denied. Admins only.' });
    }
    next();
};

export const authorizeElectionOfficer = (req, res, next) => {
    console.log(req.user);
    
    if (req.user.role !== 'electionOfficer') { // Adjust role name as per your database
        return res.status(403).json({ message: 'Access Denied. Election Officers only.' });
    }  
    next();
};

export const authorizeUser = (req, res, next) => {
    if (req.user.role !== 'user') { // Adjust role name as per your database
        return res.status(403).json({ message: 'Access Denied. Users only.' });
    }
    next();
};
