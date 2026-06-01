const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Connect to MongoDB (only if not in testing)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for local and easy deployment
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use('/api', apiLimiter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Server is healthy and running' });
});

// Main API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/aux', require('./routes/auxiliaryRoutes'));

// Global Error Handler
app.use(errorHandler);

// Listen only if not in testing environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

module.exports = app; // export for test suites
