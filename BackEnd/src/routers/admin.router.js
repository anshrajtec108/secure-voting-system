import express from 'express';
import {
    createAdmin,
    resetUserStatus,
    resetVotes,
    countVotesByRegion,
    countTotalVotes,
    verifyVoteCount,
    getAdminLogs,
    getTopErrorsOfElectionOfficers,
    handleSupportMessages,
    adminLogin,
    filterUserLogs
} from '../controllers/admin.controller.js';

const router = express.Router();

// Admin routes
router.post('/admin/create', createAdmin);
router.post('/admin/reset-user-status', resetUserStatus);
router.post('/admin/reset-votes', resetVotes);
router.get('/admin/count-votes/region/:regionId', countVotesByRegion);
router.get('/admin/count-votes/total', countTotalVotes);
router.get('/admin/verify-vote-count/:regionId', verifyVoteCount);
router.get('/admin/logs', getAdminLogs);
router.get('/admin/top-errors', getTopErrorsOfElectionOfficers);
router.post('/admin/login', adminLogin);
router.get('/admin/filter-user-logs', filterUserLogs);

export default router;
