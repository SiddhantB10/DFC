const Wishlist = require('../models/Wishlist');
const Plan = require('../models/Plan');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('plans');
    if (!wishlist) {
      wishlist = { plans: [] };
    }

    const plans = (wishlist.plans || []).filter((plan) => plan && plan.isActive);

    res.json({ success: true, plans });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { plans: planId } },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message: 'Added to wishlist', count: wishlist.plans.length });
  } catch (error) {
    console.error('Add wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
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
