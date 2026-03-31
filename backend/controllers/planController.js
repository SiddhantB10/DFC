const Plan = require('../models/Plan');

// @desc    Get all plans
// @route   GET /api/plans
exports.getPlans = async (req, res) => {
  try {
    const { category, q, minPrice, maxPrice, minRating, duration = 'monthly' } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') {
      filter.category = category;
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } }
      ];
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (minPrice || maxPrice) {
      filter[`pricing.${duration}`] = {};
      if (minPrice) filter[`pricing.${duration}`].$gte = Number(minPrice);
      if (maxPrice) filter[`pricing.${duration}`].$lte = Number(maxPrice);
    }

    const plans = await Plan.find(filter).sort({ createdAt: 1, rating: -1 });
    res.json({ success: true, count: plans.length, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching plans' });
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:slug
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ slug: req.params.slug, isActive: true });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create plan (Admin)
// @route   POST /api/plans
exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating plan' });
  }
};

// @desc    Update plan (Admin)
// @route   PUT /api/plans/:id
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating plan' });
  }
};

// @desc    Get personalized plan recommendations
// @route   GET /api/plans/recommended/me
exports.getRecommendedPlans = async (req, res) => {
  try {
    const user = req.user;
    const preferredCategories = [];

    if (user?.fitnessLevel === 'beginner') {
      preferredCategories.push('yoga', 'diet', 'combo');
    } else if (user?.fitnessLevel === 'intermediate') {
      preferredCategories.push('gym', 'combo', 'diet');
    } else {
      preferredCategories.push('gym', 'complete', 'combo');
    }

    const plans = await Plan.find({ isActive: true, category: { $in: preferredCategories } })
      .sort({ rating: -1, isPopular: -1 })
      .limit(4);

    res.json({ success: true, plans });
  } catch (error) {
    console.error('Recommended plans error:', error);
    res.status(500).json({ success: false, message: 'Error fetching recommendations' });
  }
};
