const Wishlist = require('../models/Wishlist');
const Plan = require('../models/Plan');
const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('plans')
      .populate('products');

    if (!wishlist) {
      wishlist = { plans: [], products: [] };
    }

    const plans = (wishlist.plans || []).filter((plan) => plan && plan.isActive);
    const products = (wishlist.products || []).filter((product) => product && product.isActive);

    res.json({ success: true, plans, products });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { planId, productId } = req.body;

    if (!planId && !productId) {
      return res.status(400).json({ success: false, message: 'planId or productId is required' });
    }

    if (planId && productId) {
      return res.status(400).json({ success: false, message: 'Cannot add both plan and product' });
    }

    // Handle Plan
    if (planId) {
      const plan = await Plan.findById(planId);
      if (!plan || !plan.isActive) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }

      const wishlist = await Wishlist.findOneAndUpdate(
        { user: req.user._id },
        { $addToSet: { plans: planId } },
        { upsert: true, new: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Added to wishlist',
        type: 'plan'
      });
    }

    // Handle Product
    if (productId) {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const wishlist = await Wishlist.findOneAndUpdate(
        { user: req.user._id },
        { $addToSet: { products: productId } },
        { upsert: true, new: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Added to wishlist',
        type: 'product'
      });
    }
  } catch (error) {
    console.error('Add wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { type } = req.query; // 'plan' or 'product'
    const { id } = req.params;

    if (!type || !['plan', 'product'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type. Use "plan" or "product"' });
    }

    const updateQuery = type === 'plan'
      ? { $pull: { plans: id } }
      : { $pull: { products: id } };

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      updateQuery,
      { new: true }
    );

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
};

// Keep old endpoint for backward compatibility
exports.removeFromWishlistByPlanId = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { plans: req.params.planId } },
      { new: true }
    );

    res.json({ success: true, message: 'Removed from wishlist', count: wishlist?.plans?.length || 0 });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
};
