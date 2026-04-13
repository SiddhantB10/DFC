const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, age, gender, height, weight, goalWeight, fitnessLevel, referralCode } = req.body;

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!strongPasswordRegex.test(password || '')) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include uppercase and lowercase letters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    let referredBy = null;
    if (referralCode && referralCode.trim()) {
      const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
      if (!referrer) {
        return res.status(400).json({ success: false, message: 'Invalid referral code' });
      }
      referredBy = referrer._id;
    }

    const user = await User.create({
      name, email, password, phone, age, gender, height, weight, goalWeight,
      fitnessLevel: fitnessLevel || 'beginner',
      referredBy
    });

    if (referredBy) {
      await User.findByIdAndUpdate(referredBy, {
        $inc: { loyaltyPoints: 50, totalPointsEarned: 50, referralCount: 1 }
      });
      await User.findByIdAndUpdate(user._id, {
        $inc: { loyaltyPoints: 50, totalPointsEarned: 50 }
      });
      user.loyaltyPoints += 50;
      user.totalPointsEarned += 50;
    }

    const token = user.getSignedJwtToken();

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.referralCode) {
      const fallbackCode = `DFC${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      user.referralCode = fallbackCode;
    }

    await user.save();

    const token = user.getSignedJwtToken();

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
