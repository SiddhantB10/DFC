const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['gym', 'yoga', 'diet', 'combo', 'complete']
  },
  icon: {
    type: String,
    default: '💪'
  },
  pricing: {
    monthly: { type: Number, required: true },
    quarterly: { type: Number, required: true },
    halfYearly: { type: Number, required: true },
    yearly: { type: Number, required: true }
  },
  features: [{
    type: String
  }],
  highlights: [{
    title: String,
    description: String
  }],
  personalTrainerAvailable: {
    type: Boolean,
    default: true
  },
  personalTrainerPrice: {
    type: Number,
    default: 2000
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#14b8a6'
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
