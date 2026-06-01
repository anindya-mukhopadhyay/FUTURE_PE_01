const express = require('express');
const router = express.Router();
const {
  processPayment,
  getMyPayments,
  getAllPayments,
  requestRefund
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getAllPayments);

router.post('/checkout', protect, processPayment);
router.get('/my', protect, getMyPayments);
router.put('/:id/refund', protect, requestRefund);

module.exports = router;
