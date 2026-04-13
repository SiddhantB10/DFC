const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Plan = require('../models/Plan');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

const monthsMap = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };

let razorpayClient = null;

const getInvoiceNumber = () => {
  const ts = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${ts}-${random}`;
};

const ensureRazorpayConfigured = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  const hasValues = Boolean(keyId && keySecret);
  const isPlaceholder =
    keyId === 'rzp_test_xxxxx' ||
    keySecret === 'your_test_secret' ||
    keyId.includes('xxxxx') ||
    keySecret.includes('your_test');

  return hasValues && !isPlaceholder;
};

const getRazorpayClient = () => {
  if (!ensureRazorpayConfigured()) {
    return null;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  return razorpayClient;
};

// @desc    Create checkout order and Razorpay order
// @route   POST /api/orders/checkout
exports.createCheckoutOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay test keys are missing or still placeholders. Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env and VITE_RAZORPAY_KEY_ID in frontend/.env.'
      });
    }

    const { planId, productId, duration, personalTrainer, quantity = 1, color, size, redeemPoints = 0 } = req.body;
    
    if (!planId && !productId) {
      return res.status(400).json({ success: false, message: 'Either planId or productId is required' });
    }
    
    let totalAmount = 0;
    let originalAmount = 0;
    let loyaltyDiscount = 0;
    let pointsToRedeem = Math.max(0, Number(redeemPoints) || 0);
    let orderData = { user: req.user._id, currency: 'INR', status: 'pending', paymentStatus: 'pending' };
    let notes = { userId: req.user._id.toString() };

    if (planId) {
      // Plan checkout
      const trainerRequested = personalTrainer === true;






      const plan = await Plan.findById(planId);
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }

      const planPrice = plan.pricing[duration];
      if (!planPrice || !monthsMap[duration]) {
        return res.status(400).json({ success: false, message: 'Invalid duration selected' });
      }

      if (plan.availableSlots <= 0) {
        return res.status(400).json({ success: false, message: 'This plan is currently unavailable. Please try another plan.' });
      }

      if (trainerRequested && (!plan.personalTrainerAvailable || plan.trainerSlots <= 0)) {
        return res.status(400).json({ success: false, message: 'Personal trainer slots are currently full for this plan.' });
      }

      let trainerPrice = 0;
      if (trainerRequested && plan.personalTrainerAvailable) {
        trainerPrice = plan.personalTrainerPrice * monthsMap[duration];
      }

      totalAmount = planPrice + trainerPrice;
      orderData.plan = planId;
      orderData.duration = duration;
      orderData.personalTrainer = trainerRequested;
      orderData.planPrice = planPrice;
      orderData.trainerPrice = trainerPrice;
      orderData.totalAmount = totalAmount;
      orderData.startDate = new Date();
      notes.planId = plan._id.toString();
    } else if (productId) {
      // Product checkout
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock available' });
      }

      const unitPrice = product.discountPrice || product.price;
      totalAmount = unitPrice * quantity;
      orderData.product = productId;
      orderData.quantity = quantity;
      orderData.color = color || null;
      orderData.size = size || null;
      orderData.unitPrice = unitPrice;
      orderData.totalAmount = totalAmount;
      orderData.startDate = new Date();
      notes.productId = product._id.toString();
      notes.quantity = quantity;
    }

    originalAmount = totalAmount;

    if (pointsToRedeem > 0) {
      const user = await User.findById(req.user._id).select('loyaltyPoints');
      const availablePoints = Number(user?.loyaltyPoints || 0);
      const maxPointsForOrder = Math.floor(totalAmount) * 100;
      pointsToRedeem = Math.floor(Math.min(pointsToRedeem, availablePoints, maxPointsForOrder));
      loyaltyDiscount = Math.floor(pointsToRedeem / 100);
      totalAmount = Math.max(1, totalAmount - loyaltyDiscount);
    }

    orderData.originalAmount = originalAmount;
    orderData.loyaltyDiscount = loyaltyDiscount;
    orderData.pointsRedeemed = pointsToRedeem;
    
    const amountPaise = Math.round(totalAmount * 100);

    const order = await Order.create(orderData);

    const gatewayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: order._id.toString(),
      notes
    });

    order.gatewayOrderId = gatewayOrder.id;
    await order.save();

    await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: totalAmount,
      amountPaise,
      currency: 'INR',
      razorpayOrderId: gatewayOrder.id,
      status: 'created'
    });

    res.status(201).json({
      success: true,
      orderId: order._id,
      amount: totalAmount,
      originalAmount,
      loyaltyDiscount,
      pointsRedeemed: pointsToRedeem,
      amountPaise,
      currency: 'INR',
      razorpayOrder: {
        id: gatewayOrder.id,
        amount: gatewayOrder.amount,
        currency: gatewayOrder.currency
      }
    });
  } catch (error) {
    console.error('Checkout order creation error:', error);
    res.status(500).json({
      success: false,
      message: error?.error?.description || error?.message || 'Error creating checkout order'
    });
  }
};

// @desc    Verify Razorpay payment and activate subscription
// @route   POST /api/orders/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!order.gatewayOrderId || order.gatewayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Gateway order mismatch' });
    }

    if (order.paymentStatus === 'paid' && order.invoice) {
      const existingInvoice = await Invoice.findById(order.invoice);
      return res.json({ success: true, message: 'Payment already verified', order, invoice: existingInvoice });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { order: order._id, razorpayOrderId: razorpay_order_id },
        {
          status: 'failed',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          failureReason: 'Signature verification failed'
        }
      );

      order.paymentStatus = 'failed';
      order.status = 'pending';
      await order.save();

      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const payment = await Payment.findOneAndUpdate(
      { order: order._id, razorpayOrderId: razorpay_order_id },
      {
        status: 'captured',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        failureReason: ''
      },
      { new: true }
    );

    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment record not found for this order' });
    }

    order.paymentStatus = 'paid';
    order.status = 'active';
    order.gatewayOrderId = razorpay_order_id;
    order.gatewayPaymentId = razorpay_payment_id;

    const pointsEarned = Math.max(1, Math.floor(order.totalAmount || 0));
    order.pointsEarned = pointsEarned;
    await order.save();

    const buyer = await User.findById(order.user).select('loyaltyPoints');
    const redeemedApplied = Math.floor(Math.min(order.pointsRedeemed || 0, buyer?.loyaltyPoints || 0));

    if (redeemedApplied !== (order.pointsRedeemed || 0)) {
      order.pointsRedeemed = redeemedApplied;
      await order.save();
    }

    const userUpdate = {
      $inc: {
        loyaltyPoints: pointsEarned - redeemedApplied,
        totalPointsEarned: pointsEarned,
        totalPointsRedeemed: redeemedApplied
      }
    };
    await User.findByIdAndUpdate(order.user, userUpdate);

    const userAfterUpdate = await User.findById(order.user).select('referredBy referralRewardGranted');
    if (userAfterUpdate?.referredBy && !userAfterUpdate.referralRewardGranted) {
      await User.findByIdAndUpdate(userAfterUpdate.referredBy, {
        $inc: { loyaltyPoints: 100, totalPointsEarned: 100 }
      });
      await User.findByIdAndUpdate(order.user, {
        $inc: { loyaltyPoints: 50, totalPointsEarned: 50 },
        $set: { referralRewardGranted: true }
      });
    }

    let invoiceNumber = getInvoiceNumber();
    while (await Invoice.exists({ invoiceNumber })) {
      invoiceNumber = getInvoiceNumber();
    }

      // Create invoice items based on order type
      let invoiceItems = [];
      if (order.plan) {
        const plan = await Plan.findById(order.plan).select('name');
        invoiceItems = [
          { label: 'Plan', value: plan?.name || 'Plan' },
          { label: 'Duration', value: order.duration },
          { label: 'Personal Trainer', value: order.personalTrainer ? 'Yes' : 'No' }
        ];
      } else if (order.product) {
        const product = await Product.findById(order.product).select('name');
        invoiceItems = [
          { label: 'Product', value: product?.name || 'Product' },
          { label: 'Quantity', value: order.quantity },
          { label: 'Price', value: `₹${order.unitPrice}` }
        ];
      }
    
      const invoice = await Invoice.create({
      invoiceNumber,
      order: order._id,
      payment: payment._id,
      user: req.user._id,
        items: invoiceItems,
      subtotal: order.totalAmount,
      tax: 0,
      total: order.totalAmount,
      status: 'paid'
    });

    order.invoice = invoice._id;
    await order.save();

      // Update stock/slots based on order type
      if (order.plan) {
        await Plan.findByIdAndUpdate(order.plan, {
          $inc: {
            availableSlots: -1,
            trainerSlots: order.personalTrainer ? -1 : 0
          }
        });
      } else if (order.product) {
        await Product.findByIdAndUpdate(order.product, {
          $inc: {
            stock: -order.quantity
          }
        });
      }

    const populatedOrder = await Order.findById(order._id)
        .populate('plan', 'name category icon color slug')
        .populate('product', 'name price image')
      .populate('invoice', 'invoiceNumber issuedAt total status');

    res.json({ success: true, message: 'Payment verified successfully', order: populatedOrder, invoice });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};

// @desc    Mark payment as failed
// @route   POST /api/orders/payment-failed
exports.markPaymentFailed = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, error } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.paymentStatus = 'failed';
    order.status = 'pending';
    await order.save();

    await Payment.findOneAndUpdate(
      { order: order._id, razorpayOrderId: razorpay_order_id || order.gatewayOrderId },
      {
        status: 'failed',
        failureReason: error?.description || error?.reason || 'Payment failed'
      }
    );

    res.json({ success: true, message: 'Payment marked as failed' });
  } catch (error) {
    console.error('Mark payment failed error:', error);
    res.status(500).json({ success: false, message: 'Error updating payment status' });
  }
};

// @desc    Mark payment as cancelled
// @route   POST /api/orders/payment-cancelled
exports.markPaymentCancelled = async (req, res) => {
  try {
    const { orderId, razorpay_order_id } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.paymentStatus !== 'paid') {
      order.paymentStatus = 'cancelled';
      order.status = 'cancelled';
      await order.save();
    }

    await Payment.findOneAndUpdate(
      { order: order._id, razorpayOrderId: razorpay_order_id || order.gatewayOrderId },
      {
        status: 'cancelled',
        failureReason: 'Payment cancelled by user'
      }
    );

    res.json({ success: true, message: 'Payment marked as cancelled' });
  } catch (error) {
    console.error('Mark payment cancelled error:', error);
    res.status(500).json({ success: false, message: 'Error updating payment cancellation' });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('plan', 'name category icon color slug')
      .populate('product', 'name image price')
      .populate('invoice', 'invoiceNumber issuedAt total status')
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
      .populate('product')
      .populate('user', 'name email phone')
      .populate('invoice', 'invoiceNumber issuedAt total status');

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
      paymentStatus: 'paid',
      endDate: { $gte: new Date() }
    })
    .populate('plan', 'name category icon color slug features')
    .sort({ createdAt: -1 });

    res.json({ success: true, subscription: activeOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subscription' });
  }
};

// @desc    Get invoice by order id
// @route   GET /api/orders/:id/invoice
exports.getInvoiceByOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('plan', 'name category')
      .populate('product', 'name price image')
      .populate('invoice');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!order.invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not available for this order' });
    }

    const payment = await Payment.findOne({ order: order._id }).select('razorpayPaymentId razorpayOrderId status');

    res.json({
      success: true,
      invoice: order.invoice,
      order: {
        _id: order._id,
        duration: order.duration,
        totalAmount: order.totalAmount,
        plan: order.plan,
        product: order.product,
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        color: order.color,
        size: order.size,
        personalTrainer: order.personalTrainer,
        startDate: order.startDate,
        endDate: order.endDate,
        paymentStatus: order.paymentStatus,
        gatewayPaymentId: order.gatewayPaymentId
      },
      payment
    });
  } catch (error) {
    console.error('Invoice fetch error:', error);
    res.status(500).json({ success: false, message: 'Error fetching invoice' });
  }
};
