const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'newtown_gym_super_secret_jwt_key_2026_jwt_token_auth', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, gender, dateOfBirth, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email or mobile number');
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      password,
      gender,
      dateOfBirth,
      role: role || 'member' // default to member, admins set by database or seeder
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (login via email or mobile)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { loginCredential, password } = req.body; // loginCredential can be email or mobile

    if (!loginCredential || !password) {
      res.status(400);
      throw new Error('Please provide email/mobile and password');
    }

    // Find user by email OR mobile
    const user = await User.findOne({
      $or: [{ email: loginCredential.toLowerCase() }, { mobileNumber: loginCredential }]
    });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & metrics
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.gender = req.body.gender || user.gender;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;

      // Handle height and target weight updates
      if (req.body.height) user.metrics.height = req.body.height;
      if (req.body.targetWeight) user.metrics.targetWeight = req.body.targetWeight;

      // Log new weight if provided
      if (req.body.weight) {
        user.metrics.weightLogs.push({ weight: req.body.weight });
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: updatedUser
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Mock Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('No account found with this email');
    }

    res.json({
      success: true,
      message: 'Password reset link sent to your registered email (Mocked)'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  forgotPassword
};
