const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get all users with search and filtering
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;

    const query = {};

    // 1. Full text regex search across name and email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Role filter
    if (role) {
      query.role = role;
    }

    // 3. Membership status filter
    if (status) {
      query['membership.status'] = status;
    }

    // Fetch and sort by join date
    const users = await User.find(query).select('-password').sort({ joinDate: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { fullName, email, mobileNumber, role, gender } = req.body;

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.role = role || user.role;
    user.gender = gender || user.gender;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber,
        role: updatedUser.role,
        gender: updatedUser.gender
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Override user membership manually
// @route   PUT /api/admin/users/:id/membership
// @access  Private/Admin
const overrideMembership = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { status, planType, startDate, endDate, lastPaymentId } = req.body;

    user.membership = {
      status: status || user.membership.status,
      planType: planType !== undefined ? planType : user.membership.planType,
      startDate: startDate ? new Date(startDate) : user.membership.startDate,
      endDate: endDate ? new Date(endDate) : user.membership.endDate,
      lastPaymentId: lastPaymentId !== undefined ? lastPaymentId : user.membership.lastPaymentId
    };

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all bookings
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Delete associated bookings
    await Booking.deleteMany({ member: req.params.id });

    // Delete associated payments
    await Payment.deleteMany({ member: req.params.id });

    // Remove user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `User ${user.fullName} and all linked transaction history deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate/Record a QR code or RFID check-in scanner logs
// @route   POST /api/admin/scan-checkin
// @access  Private
const scanGateCheckIn = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400);
      throw new Error('Please specify a valid userId for the gate pass scanning.');
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('Gym pass scan rejected: Member profile not found.');
    }

    // Verify membership status
    if (user.membership.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Scan rejected: Membership for ${user.fullName} is currently ${user.membership.status.toUpperCase()}.`
      });
    }

    // Append to attendance dates
    user.attendance.push(new Date());
    await user.save();

    res.json({
      success: true,
      message: `Access Granted! Welcome to Newtown Fitness Gym, ${user.fullName}.`,
      data: {
        fullName: user.fullName,
        role: user.role,
        planType: user.membership.planType,
        attendanceCount: user.attendance.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  overrideMembership,
  deleteUser,
  scanGateCheckIn
};
