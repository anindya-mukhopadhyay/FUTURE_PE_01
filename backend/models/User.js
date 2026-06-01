const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  dateOfBirth: { type: Date },
  role: { type: String, enum: ['admin', 'trainer', 'member'], default: 'member' },
  joinDate: { type: Date, default: Date.now },
  membership: {
    status: { type: String, enum: ['active', 'expired', 'none'], default: 'none' },
    planType: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    lastPaymentId: { type: String, default: '' }
  },
  metrics: {
    weightLogs: [{ date: { type: Date, default: Date.now }, weight: Number }],
    targetWeight: { type: Number, default: 0 },
    height: { type: Number, default: 0 } // in cm
  },
  workoutPlan: { type: String, default: 'Starter routine: 3 days/week full-body split.' },
  dietPlan: { type: String, default: 'Standard high-protein balanced diet.' },
  attendance: [{ type: Date }]
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
