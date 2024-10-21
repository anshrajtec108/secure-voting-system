import express from 'express';
import { generateOtp, loginWithOtp, vote, getPartyPage } from '../controllers/user.controller.js';

import { authorizeUser, authenticateTokenUser } from '../middlewares/auth.middlewares.js';
import Party from '../models/party.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { logErrorToDatabase } from '../utils/errorLogging.js';

const router = express.Router();

// Route to generate OTP for login
router.post('/login/generate-otp', generateOtp);

// Route to log in with OTP
router.post('/login/otp', loginWithOtp);


router.post('/vote',
    authenticateTokenUser,
    vote);


router.get('/party/:id', getPartyPage);

router.get('/parties', async (req, res) => {
    try {
        const parties = await Party.findAll();
        const apiResponse = new ApiResponse(200, { parties });
        res.json(apiResponse);
    } catch (error) {
        const apiError = new ApiError(500, 'Server error');
        await logErrorToDatabase('ERR005', 'server', error.message, 500, { stack: error.stack });
        res.status(apiError.statusCode).json(apiError);
    }
});
export default router;
