const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  duration: {
    type: String,
    enum: ['monthly', 'quarterly', 'halfYearly', 'yearly']
  },
  personalTrainer: {
    type: Boolean,
    default: false
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  color: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: null
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  planPrice: {
    type: Number,
    default: 0
  },
  trainerPrice: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  originalAmount: {
    type: Number,
    default: 0
  },
  pointsRedeemed: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  gatewayOrderId: {
    type: String,
    default: ''
  },
  gatewayPaymentId: {
    type: String,
    default: ''
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  whatsappConnected: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate end date based on duration before saving
orderSchema.pre('save', function(next) {
  if (this.isNew && this.duration) {
    const start = this.startDate || new Date();
    const end = new Date(start);

    switch(this.duration) {
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + 3);
        break;
      case 'halfYearly':
        end.setMonth(end.getMonth() + 6);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        break;
    }

    this.endDate = end;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
