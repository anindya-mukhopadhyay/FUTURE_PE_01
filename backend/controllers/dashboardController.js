const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const ContactQuery = require('../models/ContactQuery');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// @desc    Get stats for active member
// @route   GET /api/dashboard/member
// @access  Private
const getMemberStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const totalBookings = await Booking.countDocuments({ member: req.user._id, status: 'booked' });
    const classBookings = await Booking.countDocuments({ member: req.user._id, bookingType: 'class', status: 'booked' });
    const trainerBookings = await Booking.countDocuments({ member: req.user._id, bookingType: 'trainer', status: 'booked' });

    // Mock progress logs for water, calories if not tracked in main models to support rich gauges
    const mockHealthStats = {
      waterIntake: 2300, // ml
      waterGoal: 3000,
      caloriesBurned: 450, // kcal
      caloriesGoal: 600,
      dietSplits: { protein: 40, carbs: 40, fats: 20 }
    };

    res.json({
      success: true,
      data: {
        membership: user.membership,
        metrics: user.metrics,
        workoutPlan: user.workoutPlan,
        dietPlan: user.dietPlan,
        attendance: user.attendance,
        bookingsSummary: {
          total: totalBookings,
          classes: classBookings,
          trainers: trainerBookings
        },
        healthStats: mockHealthStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics (Admin only)
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMembers = await User.countDocuments({ role: 'member', 'membership.status': 'active' });
    const totalTrainers = await Trainer.countDocuments({});
    const totalClasses = await Class.countDocuments({});
    const totalQueries = await ContactQuery.countDocuments({});
    const newsletterCount = await NewsletterSubscriber.countDocuments({});

    // Financials
    const successfulPayments = await Payment.find({ status: 'success' });
    const totalRevenue = successfulPayments.reduce((acc, p) => acc + p.amount, 0);

    // Revenue by month mock
    const monthlyRevenue = [
      { month: 'Jan', amount: totalRevenue * 0.12 },
      { month: 'Feb', amount: totalRevenue * 0.15 },
      { month: 'Mar', amount: totalRevenue * 0.18 },
      { month: 'Apr', amount: totalRevenue * 0.22 },
      { month: 'May', amount: totalRevenue * 0.15 },
      { month: 'Jun', amount: totalRevenue * 0.18 }
    ];

    // Membership Plan Distribution
    const plansCount = {
      monthly: await Payment.countDocuments({ planType: /Monthly/i, status: 'success' }),
      quarterly: await Payment.countDocuments({ planType: /Quarterly/i, status: 'success' }),
      halfYearly: await Payment.countDocuments({ planType: /Half-Yearly/i, status: 'success' }),
      yearly: await Payment.countDocuments({ planType: /Yearly/i, status: 'success' })
    };

    // Class enrollments trends
    const classes = await Class.find({}).populate('trainer');
    const classEnrollments = classes.map(c => ({
      title: c.title,
      enrolled: c.enrolledMembers.length,
      capacity: c.capacity
    }));

    res.json({
      success: true,
      data: {
        counters: {
          totalMembers,
          activeMembers,
          totalTrainers,
          totalClasses,
          totalQueries,
          newsletterCount,
          totalRevenue
        },
        monthlyRevenue,
        plansCount,
        classEnrollments
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMemberStats,
  getAdminStats
};
