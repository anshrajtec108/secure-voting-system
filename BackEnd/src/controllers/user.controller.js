import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';

import Vote from '../models/vote.model.js';
import User from '../models/user.model.js';
import Party from '../models/party.model.js';
import PartyPhoto from '../models/partyPhoto.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { UserLog } from '../models/log.model.js'; 
import { sendOtpToPhone } from '../utils/sendOTP.js'; // Implement this service
import { logErrorToDatabase, logSecurityError } from '../utils/errorLogging.js';
import CryptoJS from 'crypto-js';


// Helper function to log actions
const logAction = async (userId, action, metadata = {}, region = null) => {
    try {
        metadata = { ...metadata, action }
        await UserLog.create({
            userId,
            metadata,
            region,
        });
    } catch (error) {
        console.error('Failed to log user action:', error);
        await logErrorToDatabase('ERR005', 'server', error.message, 500, { stack: error.stack });
    }
};

// Generate OTP
export const generateOtp = async (req, res) => {
    try {
        const { voterId, phoneNo } = req.body;
        console.log(voterId, phoneNo);

        if (!voterId || !phoneNo) {
            const apiError = new ApiError(404, 'voterId and phoneNo required');
            await logErrorToDatabase('ERR001', 'security', 'voterId and phoneNo required', 404, { voterId, phoneNo });
            return res.status(apiError.statusCode).json(apiError);
        }

        const user = await User.findOne({ where: { voterId, phoneNo, } });

        if (!user) {
            console.log("user", user);
            const apiError = new ApiError(404, 'User not found');
            await logErrorToDatabase('ERR004', 'security', 'User not found', 404, { voterId, phoneNo });
            return res.status(apiError.statusCode).json(apiError);
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 30 * 1000); // OTP expires in 30 seconds
        await user.save();

        await sendOtpToPhone(phoneNo, otp); // Assume a function to send OTP
        const apiResponse = new ApiResponse(200, null, 'OTP sent');
        await logAction(user.id, 'Generate OTP - Success', { otpSent: true });
        res.json(apiResponse);
    } catch (error) {
        const apiError = new ApiError(500, `Server error: ${error}`);
        await logErrorToDatabase('ERR005', 'server', error.message, 500, { stack: error.stack });
        res.status(apiError.statusCode).json(apiError);
    }
};

// Login with Voter ID and OTP
export const loginWithOtp = async (req, res) => {
    try {
        const { voterId, otp } = req.body;
        const user = await User.findOne({ where: { voterId, otp } });

        if (!user) {
            const apiError = new ApiError(401, 'Invalid or expired OTP');
            await logErrorToDatabase('ERR002', 'security', 'Invalid or expired OTP during login', 401, { voterId, otp });
            return res.status(apiError.statusCode).json(apiError);
        }

        if (user.block !== "none") {
            const apiError = new ApiError(403, 'User is blocked');
            await logErrorToDatabase('ERR003', 'security', 'User is blocked', 403, { voterId, otp });
            return res.status(apiError.statusCode).json(apiError);
        }

        user.otp = 0; // Clear OTP after successful login
        user.otpExpires = 0;
        user.attemptLogin = user.attemptLogin + 1;
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        req.user = { user };
        req.user.role = "user";
        const apiResponse = new ApiResponse(200, { token });
        await logAction(user.id, 'Login Successful');
        res.json(apiResponse);
    } catch (error) {
        const apiError = new ApiError(500, 'Server error');
        console.log("error", error);
        await logErrorToDatabase('ERR005', 'server', error.message, 500, { stack: error.stack });
        res.status(apiError.statusCode).json(apiError);
    }
};

// Vote Function
export const vote = async (req, res) => {
    try {
        const { partyId } = req.body;
        const userId = req.user.id;

        // Check the user's current voting status
        const user = await User.findByPk(userId);
        if (!user) {
            const apiError = new ApiError(404, 'User not found');
            return res.status(apiError.statusCode).json(apiError);
        }

        if (user.status === 'done') {
            // If user has already voted, respond with a message
            const apiError = new ApiError(400, 'You have already voted');
            return res.status(apiError.statusCode).json(apiError);
        }

        // Proceed to record the vote
        const vote = await Vote.create({
            userId,
            partyId,
            regionId: req.user.regionId,
            timestamp: new Date(),
        });

        // Update the user's status to 'done' after voting
        await User.update({ status: 'done' }, { where: { id: userId } });

        const apiResponse = new ApiResponse(200, { vote }, 'Vote successfully recorded');
        await logAction(userId, 'Vote Recorded', { partyId }, req.user.regionId);
        res.json(apiResponse);
    } catch (error) {
        const apiError = new ApiError(500, 'Server error');
        await logErrorToDatabase('ERR005', 'server', error.message, 500, { stack: error.stack });
        res.status(apiError.statusCode).json(apiError);
    }
};


// Party Page Function


export const getPartyPage = async (req, res) => {
    try {
        let partyId=4
        // Secret key for encryption (ensure this is securely stored in environment variables)
        const secretKey = process.env.SECRET_KEY || 'mysecretkey'; // replace with your actual secret key

        
        // Fetch the party from the database using the original partyId
        const party = await Party.findOne({
            where: { id: partyId }, // using the original partyId here
            include: [{ model: PartyPhoto, as: 'photos' }],
        });
        const eyData=CryptoJS.AES.encrypt(JSON.stringify(party), "secretKey").toString();
    

        if (!party) {
            const apiError = new ApiError(404, 'Party not found');
            await logErrorToDatabase('ERR004', 'security', 'Party not found', 404, { partyId: eyData });
            return res.status(apiError.statusCode).json(apiError);
        }

    const apiResponse = new ApiResponse(200, { party, eyData }); // send encrypted partyId in the response
        res.json(apiResponse);
    } catch (error) {
        const apiError = new ApiError(500, 'Server error');
        await logErrorToDatabase('ERR005', 'server', error.message, 500, { stack: error.stack });
        res.status(apiError.statusCode).json(apiError);
    }
};

