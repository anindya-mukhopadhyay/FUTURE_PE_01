const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingType: { type: String, enum: ['class', 'trainer', 'consultation'], required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
