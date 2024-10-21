import { User, Vote, Region, ElectionOfficer, Admin } from '../models/index.model.js';
import { logger } from '../middlewares/auth.middlewares.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Import Log Models
import { UserLog, ElectionOfficerLog, ServerError, AdminLog, SecurityError  } from '../models/log.model.js'
import { logErrorToDatabase } from '../utils/errorLogging.js';



// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const OTP_EXPIRY = 30; // OTP expiry time in seconds

// Generate a random string for Admin ID and Password
const generateRandomString = (length) => crypto.randomBytes(length).toString('hex');

// Function to generate OTP and send it to the phone number
const generateAndSendOTP = async (phoneNo) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    // Save OTP and its expiry time in the database or in-memory store for verification
    await Admin.updateOne({ phoneNo1: phoneNo }, { otp, otpExpiry: Date.now() + OTP_EXPIRY * 1000 });

    // Log OTP generation


    console.log(phoneNo, `Your OTP is ${otp}`);
};

export const createAdmin = async (req, res) => {
    try {
        const { adminId, name, password, phoneNo1, phoneNo2 } = req.body;

        // Validate input
        if (!adminId || !name || !password || !phoneNo1) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Check if admin with the same adminId or phoneNo1 already exists
        const existingAdmin = await Admin.findOne({
            where: {
                [Op.or]: [
                    { adminId },
                    { phoneNo1 }
                ]
            }
        });

        if (existingAdmin) {
            await AdminLog.create({
                level: 'warn',
                message: 'Admin ID or phone number already in use',
                timestamp: new Date(),
                meta: { adminId, phoneNo1 }
            });
            return res.status(400).json({ message: 'Admin ID or phone number already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = await Admin.create({
            adminId,
            name,
            password: hashedPassword,
            phoneNo1,
            phoneNo2
        });

        await AdminLog.create({
            level: 'info',
            message: 'Admin created successfully',
            timestamp: new Date(),
            meta: { adminId, name }
        });

        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        logger.error('Error creating admin', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error creating admin',
            timestamp: new Date(),
            meta: { error, functionName: 'createAdmin' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset User Status and Block Users
export const resetUserStatus = async (req, res) => {
    try {
        const { blockByEmail } = req.body; // Assume blocking is done by email

        // Block users one by one
        const users = await User.find({ status: 'active' });
        for (const user of users) {
            if (blockByEmail) {
                // Log blocking action
                
                // Optionally send an email notification about blocking
                // Use your preferred email service to notify user
            }
            await User.updateOne({ _id: user._id }, { status: 'blocked' });
        }

        // Delete users who are blocked
        await User.deleteMany({ status: 'blocked' });

        await AdminLog.create({
            level: 'info',
            message: 'User statuses reset and blocked users deleted',
            timestamp: new Date()
        });

        res.json({ message: 'User statuses reset and blocked users deleted' });
    } catch (error) {
        logger.error('Error resetting user status', { error });
        await logErrorToDatabase.create({
            level: 'error',
            message: 'Error resetting user status',
            timestamp: new Date(),
            meta: { error, functionName: 'resetUserStatus' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Votes
export const resetVotes = async (req, res) => {
    try {
        const { electionId } = req.body; // ID for new election context

        // Create a copy of existing votes or create new votes for another election
        const existingVotes = await Vote.findAll();
        const votesCopy = existingVotes.map(vote => ({
            ...vote.toJSON(),
            electionId // Associate with new election
        }));

        await Vote.bulkCreate(votesCopy);

        await AdminLog.create({
            level: 'info',
            message: 'Votes reset and copied for new election',
            timestamp: new Date(),
            meta: { electionId }
        });

        res.json({ message: 'Votes reset and copied for new election' });
    } catch (error) {
        logger.error('Error resetting votes', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error resetting votes',
            timestamp: new Date(),
            meta: { error, functionName: 'resetVotes' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Count Votes by Region
export const countVotesByRegion = async (req, res) => {
    try {
        const { regionId } = req.params;
        const voteCount = await Vote.count({ where: { regionId } });

        await AdminLog.create({
            level: 'info',
            message: `Counted votes for region ${regionId}`,
            timestamp: new Date(),
            meta: { regionId, voteCount }
        });

        res.json({ regionId, voteCount });
    } catch (error) {
        logger.error('Error counting votes by region', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error counting votes by region',
            timestamp: new Date(),
            meta: { error, functionName: 'countVotesByRegion' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Count Total Votes
export const countTotalVotes = async (req, res) => {
    try {
        const totalVotes = await Vote.count();

        await AdminLog.create({
            level: 'info',
            message: 'Counted total votes',
            timestamp: new Date(),
            meta: { totalVotes }
        });

        res.json({ totalVotes });
    } catch (error) {
        logger.error('Error counting total votes', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error counting total votes',
            timestamp: new Date(),
            meta: { error, functionName: 'countTotalVotes' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify Vote Count
export const verifyVoteCount = async (req, res) => {
    try {
        const { regionId } = req.params;
        const regionVotes = await Vote.count({ where: { regionId } });
        const actualVotes = await Region.findOne({ where: { id: regionId } });

        // Add your verification logic here
        const isVerified = regionVotes === actualVotes.voteCount;

        await AdminLog.create({
            level: 'info',
            message: `Verified vote count for region ${regionId}`,
            timestamp: new Date(),
            meta: { regionId, isVerified }
        });

        res.json({ regionId, isVerified });
    } catch (error) {
        logger.error('Error verifying vote count', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error verifying vote count',
            timestamp: new Date(),
            meta: { error, functionName: 'verifyVoteCount' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin Logs with Chart
export const getAdminLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        logger.error('Error retrieving admin logs', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error retrieving admin logs',
            timestamp: new Date(),
            meta: { error, functionName: 'getAdminLogs' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Top Errors of Election Officers
export const getTopErrorsOfElectionOfficers = async (req, res) => {
    try {
        const errors = await ElectionOfficerLog .find().sort({ timestamp: -1 }).limit(10);
        res.json(errors);
    } catch (error) {
        logger.error('Error retrieving top errors of election officers', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error retrieving top errors of election officers',
            timestamp: new Date(),
            meta: { error, functionName: 'getTopErrorsOfElectionOfficers' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Support Messages Handling
export const handleSupportMessages = async (req, res) => {
    try {
        const { electionOfficerID, regionID, message } = req.body;

        const supportMessage = await SupportMessage.create({ electionOfficerID, regionID, message });

        await AdminLog.create({
            level: 'info',
            message: 'Support message received',
            timestamp: new Date(),
            meta: { electionOfficerID, regionID, messageId: supportMessage._id }
        });

        res.status(201).json({ message: 'Support message received', supportMessage });
    } catch (error) {
        logger.error('Error handling support messages', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error handling support messages',
            timestamp: new Date(),
            meta: { error, functionName: 'handleSupportMessages' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { adminId, password, otp } = req.body;

        // Find admin by adminId
        const admin = await Admin.findOne({ where: { adminId } });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin ID or password' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid admin ID or password' });
        }

        // Verify OTP
        if (otp) {
            const isOtpValid = admin.otp === otp && admin.otpExpiry > Date.now();
            if (!isOtpValid) {
                return res.status(401).json({ message: 'Invalid or expired OTP' });
            }

            // Clear OTP after successful verification
            await Admin.updateOne({ adminId }, { otp: null, otpExpiry: null });
        } else {
            // Send OTP if it's not provided
            await generateAndSendOTP(admin.phoneNo1);
            return res.json({ message: 'OTP sent to your phone number' });
        }

        // Generate JWT Token
        const token = jwt.sign({ adminId: admin.adminId }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
   
        await ErrorLog.create({ level: 'error', message: 'Error during login', timestamp: new Date(), meta: { error } });
        res.status(500).json({ message: 'Server error' });
    }
};


// Filter User Logs
export const filterUserLogs = async (req, res) => {
    try {
        const { level, startDate, endDate, userId } = req.query;
        const query = {
            ...(level && { level }),
            ...(userId && { userId }),
            ...(startDate && { timestamp: { $gte: new Date(startDate) } }),
            ...(endDate && { timestamp: { $lte: new Date(endDate) } }),
        };

        const logs = await UserLog.find(query).sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
       res.status(500).json({ message: 'Server error' });
    }
};

// Filter Election Officer Logs
export const filterElectionOfficerLogs = async (req, res) => {
    try {
        const { level, errorLevel, startDate, endDate, electionOfficerID } = req.query;
        const query = {
            ...(level && { level }),
            ...(errorLevel && { errorLevel }),
            ...(electionOfficerID && { electionOfficerID }),
            ...(startDate && { timestamp: { $gte: new Date(startDate) } }),
            ...(endDate && { timestamp: { $lte: new Date(endDate) } }),
        };

        const logs = await ElectionOfficerLog.find(query).sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        logger.error('Error filtering election officer logs', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error filtering election officer logs',
            timestamp: new Date(),
            meta: { error, functionName: 'filterElectionOfficerLogs' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Filter Admin Logs
export const filterAdminLogs = async (req, res) => {
    try {
        const { level, startDate, endDate, adminId } = req.query;
        const query = {
            ...(level && { level }),
            ...(adminId && { 'meta.adminId': adminId }), // Assuming adminId is stored in meta
            ...(startDate && { timestamp: { $gte: new Date(startDate) } }),
            ...(endDate && { timestamp: { $lte: new Date(endDate) } }),
        };

        const logs = await AdminLog.find(query).sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        logger.error('Error filtering admin logs', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error filtering admin logs',
            timestamp: new Date(),
            meta: { error, functionName: 'filterAdminLogs' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};

// Filter Server Error Logs
export const filterServerErrorLogs = async (req, res) => {
    try {
        const { level, functionName, startDate, endDate } = req.query;
        const query = {
            ...(level && { level }),
            ...(functionName && { 'meta.functionName': functionName }), // Assuming functionName is stored in meta
            ...(startDate && { timestamp: { $gte: new Date(startDate) } }),
            ...(endDate && { timestamp: { $lte: new Date(endDate) } }),
        };

        const logs = await ServerErrorLog.find(query).sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        logger.error('Error filtering server error logs', { error });
        await ServerErrorLog.create({
            level: 'error',
            message: 'Error filtering server error logs',
            timestamp: new Date(),
            meta: { error, functionName: 'filterServerErrorLogs' }
        });
        res.status(500).json({ message: 'Server error' });
    }
};
