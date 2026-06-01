const express = require('express');
const router = express.Router();
const { getMemberStats, getAdminStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/member', protect, getMemberStats);
router.get('/admin', protect, authorize('admin'), getAdminStats);

module.exports = router;
