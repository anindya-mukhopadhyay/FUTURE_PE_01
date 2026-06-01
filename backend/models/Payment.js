const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, required: true }, // e.g. "Monthly", "Quarterly", "Half-Yearly", "Yearly"
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['success', 'failed', 'refunded'], default: 'success' },
  invoiceNumber: { type: String, required: true, unique: true },
  purchaseDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  paymentMethod: { type: String, default: 'UPI' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
