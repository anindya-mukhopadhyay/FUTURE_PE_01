const mongoose = require('mongoose');

const ContactQuerySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  subject: { type: String, default: 'General Inquiry', trim: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  adminResponse: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ContactQuery', ContactQuerySchema);
