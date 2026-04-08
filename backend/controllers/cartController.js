const Cart = require('../models/Cart');
const Plan = require('../models/Plan');
const Product = require('../models/Product');

const monthsMap = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };

const calcItemAmount = (item) => {
  if (item.plan) {
    // Plan pricing
    const planPrice = item.plan?.pricing?.[item.duration] || 0;
    const trainerPrice = item.personalTrainer ? (item.plan.personalTrainerPrice || 0) * monthsMap[item.duration] : 0;
    return { amount: planPrice + trainerPrice, type: 'plan' };
  } else if (item.product) {
    // Product pricing
    return { amount: item.price * item.quantity, type: 'product' };
  }
  return { amount: 0, type: 'unknown' };
};

exports.getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.plan')
      .populate('items.product');

    if (!cart) {
      return res.json({ success: true, items: [], totals: { subtotal: 0 } });
    }

    const items = cart.items
      .filter((item) => item.plan || item.product)
      .map((item) => {
        const pricing = calcItemAmount(item);
        return {
          _id: item._id,
          plan: item.plan,
          product: item.product,
          quantity: item.quantity,
          duration: item.duration,
          personalTrainer: item.personalTrainer,
          color: item.color,
          size: item.size,
          price: item.price,
          type: item.product ? 'product' : 'plan',
          amount: pricing.amount
        };
      });

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    res.json({ success: true, items, totals: { subtotal } });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { planId, productId, quantity = 1, color, size, duration, personalTrainer } = req.body;

    // Validate input
    if (planId && productId) {
      return res.status(400).json({ success: false, message: 'Cannot add both plan and product' });
    }

    if (!planId && !productId) {
      return res.status(400).json({ success: false, message: 'planId or productId is required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Handle Plan
    if (planId) {
      if (!duration) {
        return res.status(400).json({ success: false, message: 'duration is required for plans' });
      }

      if (!monthsMap[duration]) {
        return res.status(400).json({ success: false, message: 'Invalid duration' });
      }

      const plan = await Plan.findById(planId);
      if (!plan || !plan.isActive) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }

      const trainerRequested = personalTrainer === true;
      const existingIndex = cart.items.findIndex(
        (item) =>
          item.plan &&
          item.plan.toString() === planId &&
          item.duration === duration &&
          item.personalTrainer === trainerRequested
      );

      if (existingIndex !== -1) {
        return res.status(200).json({ success: true, message: 'Plan already in cart' });
      }

      const planPrice = plan?.pricing?.[duration] || 0;
      const trainerPrice = trainerRequested ? (plan.personalTrainerPrice || 0) * monthsMap[duration] : 0;
      const totalPrice = planPrice + trainerPrice;

      cart.items.push({
        plan: planId,
        duration,
        personalTrainer: trainerRequested,
        price: totalPrice
      });
    }

    // Handle Product
    if (productId) {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }

      // Check for existing product
      const existingIndex = cart.items.findIndex(
        (item) =>
          item.product &&
          item.product.toString() === productId &&
          item.color === (color || null) &&
          item.size === (size || null)
      );

      if (existingIndex !== -1) {
        // Update quantity
        cart.items[existingIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          product: productId,
          quantity,
          color: color || null,
          size: size || null,
          price: product.discountPrice || product.price
        });
      }
    }

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

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    // Only products have quantity updates
    if (item.product) {
      const product = await Product.findById(item.product);
      if (quantity > (product?.stock || 0)) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      item.quantity = Math.max(1, quantity);
    }

    await cart.save();

    res.json({ success: true, message: 'Cart item updated' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart item' });
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
