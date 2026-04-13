const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
  },
  age: {
    type: Number,
    required: [true, 'Please provide your age'],
    min: 14,
    max: 100
  },
  gender: {
    type: String,
    required: [true, 'Please select your gender'],
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number,
    required: [true, 'Please provide your height in cm'],
    min: 100,
    max: 250
  },
  weight: {
    type: Number,
    required: [true, 'Please provide your weight in kg'],
    min: 30,
    max: 300
  },
  goalWeight: {
    type: Number,
    required: [true, 'Please provide your goal weight in kg'],
    min: 30,
    max: 200
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPointsRedeemed: {
    type: Number,
    default: 0,
    min: 0
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    trim: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralCount: {
    type: Number,
    default: 0,
    min: 0
  },
  referralRewardGranted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const generateReferralCode = () => {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DFC${part}`;
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);
