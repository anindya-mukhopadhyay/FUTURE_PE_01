const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateMe, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/forgotpassword', forgotPassword);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
