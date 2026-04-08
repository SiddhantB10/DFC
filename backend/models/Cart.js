const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  // For plans
  duration: {
    type: String,
    enum: ['monthly', 'quarterly', 'halfYearly', 'yearly']
  },
  personalTrainer: {
    type: Boolean,
    default: false
  },
  // For products
  color: {
    type: String
  },
  size: {
    type: String
  },
  price: {
    type: Number,
    required: true
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
