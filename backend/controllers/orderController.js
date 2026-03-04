const Order = require('../models/Order');
const Plan = require('../models/Plan');

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { planId, duration, personalTrainer } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const planPrice = plan.pricing[duration];
    if (!planPrice) {
      return res.status(400).json({ success: false, message: 'Invalid duration selected' });
    }

    // Calculate trainer price based on duration months
    let trainerPrice = 0;
    if (personalTrainer && plan.personalTrainerAvailable) {
      const monthsMap = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };
      trainerPrice = plan.personalTrainerPrice * (monthsMap[duration] || 1);
    }

    const totalAmount = planPrice + trainerPrice;

    const order = await Order.create({
      user: req.user._id,
      plan: planId,
      duration,
      personalTrainer,
      planPrice,
      trainerPrice,
      totalAmount,
      startDate: new Date(),
      endDate: new Date() // Will be calculated by pre-save hook
    });

    const populatedOrder = await Order.findById(order._id).populate('plan', 'name category icon color');

    res.status(201).json({ success: true, order: populatedOrder });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Error creating order' });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('plan', 'name category icon color slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('plan')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user owns the order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
};

// @desc    Get active subscription
// @route   GET /api/orders/active
exports.getActiveSubscription = async (req, res) => {
  try {
    const activeOrder = await Order.findOne({
      user: req.user._id,
      status: 'active',
      endDate: { $gte: new Date() }
    })
    .populate('plan', 'name category icon color slug features')
    .sort({ createdAt: -1 });

    res.json({ success: true, subscription: activeOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subscription' });
  }
};
