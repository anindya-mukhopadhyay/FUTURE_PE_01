const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Trainer = require('../models/Trainer');
const User = require('../models/User');

// @desc    Create session booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { bookingType, classId, trainerId, date, timeSlot } = req.body;

    const user = await User.findById(req.user._id);

    // Rule: Non-active members can only book standard trials or consultations.
    if (bookingType !== 'consultation' && (!user.membership || user.membership.status !== 'active')) {
      res.status(403);
      throw new Error('Active membership required to book gym classes or personal trainer slots');
    }

    // Check duplicate booking for the same slot
    const existingBooking = await Booking.findOne({
      member: req.user._id,
      date: new Date(date),
      timeSlot,
      status: 'booked'
    });

    if (existingBooking) {
      res.status(400);
      throw new Error('You already have a booking scheduled for this exact day and time slot');
    }

    let classObj = null;
    let trainerObj = null;

    if (bookingType === 'class') {
      if (!classId) {
        res.status(400);
        throw new Error('Class ID is required for class bookings');
      }

      classObj = await Class.findById(classId);
      if (!classObj) {
        res.status(404);
        throw new Error('Selected class does not exist');
      }

      // Check capacity
      if (classObj.enrolledMembers.length >= classObj.capacity) {
        res.status(400);
        throw new Error('This class session has reached its full occupant capacity');
      }

      // Add to class enrollments
      if (!classObj.enrolledMembers.includes(req.user._id)) {
        classObj.enrolledMembers.push(req.user._id);
        await classObj.save();
      }
    } else if (bookingType === 'trainer') {
      if (!trainerId) {
        res.status(400);
        throw new Error('Trainer ID is required for trainer bookings');
      }

      trainerObj = await Trainer.findById(trainerId);
      if (!trainerObj) {
        res.status(404);
        throw new Error('Selected trainer does not exist');
      }
    }

    const booking = await Booking.create({
      member: req.user._id,
      bookingType,
      classId,
      trainerId,
      date: new Date(date),
      timeSlot,
      status: 'booked'
    });

    // Populate references before sending response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('classId')
      .populate('trainerId');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ member: req.user._id })
      .populate({
        path: 'classId',
        populate: { path: 'trainer' }
      })
      .populate('trainerId')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Authorization check
    if (booking.member.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === 'cancelled') {
      res.status(400);
      throw new Error('This booking is already cancelled');
    }

    booking.status = 'cancelled';
    await booking.save();

    // If it was a class booking, remove member from Class enrolled list
    if (booking.bookingType === 'class' && booking.classId) {
      const classObj = await Class.findById(booking.classId);
      if (classObj) {
        classObj.enrolledMembers = classObj.enrolledMembers.filter(
          (mId) => mId.toString() !== booking.member.toString()
        );
        await classObj.save();
      }
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('member', 'fullName email mobileNumber')
      .populate('classId')
      .populate('trainerId')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings
};
