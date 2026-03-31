const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  duration: {
    type: String,
    enum: ['monthly', 'quarterly', 'halfYearly', 'yearly'],
    required: true
  },
  personalTrainer: {
    type: Boolean,
    default: false
  }
}, { _id: true, timestamps: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: {
    type: [cartItemSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
