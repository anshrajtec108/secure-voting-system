import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import { User, Vote, Region, ElectionOfficer } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendOtpToPhone } from '../utils/sendOTP.js';
import { logErrorToDatabase } from '../utils/errorLogging.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ElectionOfficerLog, UserLog } from '../models/log.model.js';


// ElectionOfficerLog  //the to get the qu


export const generateOtpEletionOfficer = async (req, res) => {
    try {
        const { electionOfficerId, phoneNo } = req.body;
        console.log(electionOfficerId, phoneNo);


        if (!electionOfficerId || !phoneNo) {

            const apiError = new ApiError(404, 'electionOfficerId, phoneNo required  ');
            await logErrorToDatabase('security', 'electionOfficerId, phoneNo required ', 404, { electionOfficerId, phoneNo });
            return res.status(apiError.statusCode).json(apiError);
        }
        const user = await ElectionOfficer.findOne({ where: { electionOfficerId, phoneNo } });

        if (!user) {
            console.log("user", user);

            const apiError = new ApiError(404, 'User not found');
            return res.status(apiError.statusCode).json(apiError);
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 30 * 1000); // OTP expires in 30 seconds
        await user.save();

        await sendOtpToPhone(phoneNo, otp); // Assume a function to send OTP
        const apiResponse = new ApiResponse(200, null, 'OTP sent');
        res.json(apiResponse);
    } catch (error) {
        const apiError = new ApiError(500, `Server error${error}`);
        await logErrorToDatabase('server', error.message, 500, { stack: error.stack });
        res.status(apiError.statusCode).json(apiError);
    }
};

// Login Function (with OTP verification)
export const login = async (req, res) => {
    try {
        const { electionOfficerId, password, otp } = req.body;
        const officer = await ElectionOfficer.findOne({ where: { electionOfficerId } });

        if (!officer) {
            const message = 'Election Officer not found';
            return res.status(404).json({ message });
        }

        // const isMatch = await bcrypt.compare(password, officer.password);

        if (!(password == officer.password)) {
            console.log("password  officer.password", password, officer.password, !(password == officer.password));

            const message = 'Invalid credentials';
            return res.status(401).json({ message });
        }

        if (otp !== officer.otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        req.user = officer;
        req.user.role = "electionOfficer";
        const token = jwt.sign({ id: officer.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: `Server error${error}`, });
    }
};

// Logout Function
export const logout = async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Count Votes Based on Region
export const countVotesByRegion = async (req, res) => {
    try {
        const { regionId } = req.params;
        const voteCount = await Vote.count({ where: { regionId } });
        res.json({ regionId, voteCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Retrieve Logs with Chart Data
export const getRegionLogs = async (req, res) => {
    try {
        const logs = await UserLog.findAll({ regionID: req.params.regionId });
        res.json(logs);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Server error',error });
    }
};

// Get Top Errors for Election Officer
export const getTopErrors = async (req, res) => {
    try {
        const logs = await ElectionOfficerLog.find({ electionOfficerId: req.params.electionOfficerId })
            .sort({ timestamp: -1 })
            .limit(5);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const createUser = async (req, res) => {
    try {
        const { fullname, phoneNo, voterId, address, regionId } = req.body;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({ fullname, phoneNo, voterId, address, regionId, password: hashedPassword });
        res.json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { userId, ...updateFields } = req.body;
        await User.update(updateFields, { where: { id: userId } });
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// OTP Generation
export const generateOTP = async (req, res) => {
    try {
        const { voterId } = req.body;
        const user = await User.findOne({ where: { voterId } });

        if (!user) {
            const message = 'User not found';
            return res.status(404).json({ message });
        }

        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        user.otp = otp;
        await user.save();

        // Logic to send OTP (e.g., via SMS or Email)
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
