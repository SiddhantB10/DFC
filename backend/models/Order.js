const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  duration: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'halfYearly', 'yearly']
  },
  personalTrainer: {
    type: Boolean,
    default: false
  },
  planPrice: {
    type: Number,
    required: true
  },
  trainerPrice: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
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
    type: Date,
    required: true
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
  if (this.isNew) {
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
    }
    
    this.endDate = end;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
