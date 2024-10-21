import express from 'express';
import {
    login,
    logout,
    countVotesByRegion,
    getRegionLogs,
    getTopErrors,
    generateOtpEletionOfficer,
} from "../controllers/electionOfficer.controller.js";

import { authorizeElectionOfficer } from '../middlewares/auth.middlewares.js';
import { authenticateTokenElectionOfficer } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/login/generate-otp', generateOtpEletionOfficer)
// Route for login with OTP verification
router.post('/login', login);

// Route for logout
router.post('/logout', authenticateTokenElectionOfficer, logout);

// Route to count votes based on region
router.get('/votes/count/:regionId', authenticateTokenElectionOfficer, authorizeElectionOfficer , countVotesByRegion);

// Route to start the voting process
// router.post('/voting/start', authenticateTokenElectionOfficer, authorizeElectionOfficer, startVoting);

// Route to retrieve logs with chart data
router.get('/logs/:regionId', 
    authenticateTokenElectionOfficer, 
    authorizeElectionOfficer,
    getRegionLogs
);

// Route to get top errors for a specific election officer
router.get('/errors/top/:electionOfficerID', authenticateTokenElectionOfficer, authorizeElectionOfficer, getTopErrors);

export default router;
