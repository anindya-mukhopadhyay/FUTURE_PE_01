const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  scheduleDays: [{ type: String }], // e.g. ["Monday", "Wednesday", "Friday"]
  timeSlot: { type: String, required: true }, // e.g. "09:00 - 10:00"
  capacity: { type: Number, required: true, default: 20 },
  enrolledMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);
