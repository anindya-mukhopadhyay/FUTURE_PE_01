const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: '' },
  specialization: [{ type: String }],
  experience: { type: Number, required: true }, // in years
  certifications: [{ type: String }],
  email: { type: String, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  schedule: [{ type: String }], // e.g., ["08:00 - 09:00", "10:00 - 11:00", "17:00 - 18:00"]
  bio: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', TrainerSchema);
