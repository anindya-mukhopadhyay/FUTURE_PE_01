const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Process a mock Razorpay / online payment
// @route   POST /api/payments/checkout
// @access  Private
const processPayment = async (req, res, next) => {
  try {
    const { planType, amount, paymentId, paymentMethod } = req.body;

    if (!planType || !amount || !paymentId) {
      res.status(400);
      throw new Error('Plan type, amount, and payment ID are required to checkout');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User account not found');
    }

    // Determine plan duration in days
    let daysToAdd = 30; // default Monthly
    if (planType.toLowerCase().includes('quarterly')) daysToAdd = 90;
    else if (planType.toLowerCase().includes('half-yearly')) daysToAdd = 180;
    else if (planType.toLowerCase().includes('yearly')) daysToAdd = 365;
    else if (planType.toLowerCase().includes('personal')) daysToAdd = 30;

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + daysToAdd);

    // Generate custom, premium styled invoice number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `NTF-INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomSuffix}`;

    // Write to Payment Collection
    const payment = await Payment.create({
      member: req.user._id,
      planType,
      amount,
      paymentId,
      status: 'success',
      invoiceNumber,
      purchaseDate: startDate,
      expiryDate,
      paymentMethod: paymentMethod || 'UPI'
    });

    // Update User Membership details immediately
    user.membership = {
      status: 'active',
      planType,
      startDate,
      endDate: expiryDate,
      lastPaymentId: paymentId
    };
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Subscription payment completed and activated successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's payments (invoice list)
// @route   GET /api/payments/my
// @access  Private
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ member: req.user._id }).sort({ purchaseDate: -1 });
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payment transactions (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({})
      .populate('member', 'fullName email mobileNumber')
      .sort({ purchaseDate: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request a refund for a payment
// @route   PUT /api/payments/:id/refund
// @access  Private
const requestRefund = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404);
      throw new Error('Payment transaction record not found');
    }

    if (payment.member.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to access this billing record');
    }

    if (payment.status === 'refunded') {
      res.status(400);
      throw new Error('This transaction has already been refunded');
    }

    payment.status = 'refunded';
    await payment.save();

    // Revoke user membership if it's their active plan
    const user = await User.findById(payment.member);
    if (user && user.membership.lastPaymentId === payment.paymentId) {
      user.membership.status = 'expired';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Refund request processed. Funds will return to original source (simulated)',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
  getMyPayments,
  getAllPayments,
  requestRefund
};
