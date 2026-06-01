const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  updateUser,
  overrideMembership,
  deleteUser,
  scanGateCheckIn
} = require('../controllers/adminController');

// All routes require authentication
router.use(protect);

// Self-checkin gate pass scan can be performed by members themselves
router.post('/scan-checkin', scanGateCheckIn);

// All other routes are administrative only
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/membership', overrideMembership);
router.delete('/users/:id', deleteUser);

module.exports = router;
