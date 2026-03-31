const Cart = require('../models/Cart');
const Plan = require('../models/Plan');

const monthsMap = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };

const calcItemAmount = (plan, duration, personalTrainer) => {
  const planPrice = plan?.pricing?.[duration] || 0;
  const trainerPrice = personalTrainer ? (plan.personalTrainerPrice || 0) * monthsMap[duration] : 0;
  return { planPrice, trainerPrice, total: planPrice + trainerPrice };
};

exports.getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.plan');

    if (!cart) {
      return res.json({ success: true, items: [], totals: { subtotal: 0 } });
    }

    const items = cart.items
      .filter((item) => item.plan)
      .map((item) => {
        const pricing = calcItemAmount(item.plan, item.duration, item.personalTrainer);
        return {
          _id: item._id,
          plan: item.plan,
          duration: item.duration,
          personalTrainer: item.personalTrainer,
          pricing
        };
      });

    const subtotal = items.reduce((sum, item) => sum + item.pricing.total, 0);

    res.json({ success: true, items, totals: { subtotal } });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { planId, duration, personalTrainer } = req.body;

    if (!planId || !duration) {
      return res.status(400).json({ success: false, message: 'planId and duration are required' });
    }

    if (!monthsMap[duration]) {
      return res.status(400).json({ success: false, message: 'Invalid duration' });
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const trainerRequested = personalTrainer === true;
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.plan.toString() === planId &&
        item.duration === duration &&
        item.personalTrainer === trainerRequested
    );

    if (existingIndex !== -1) {
      return res.status(200).json({ success: true, message: 'Plan already in cart' });
    }

    cart.items.push({
      plan: planId,
      duration,
      personalTrainer: trainerRequested
    });

    await cart.save();

    res.status(201).json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Error removing cart item' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
};
