const Plan = require('../models/Plan');

// @desc    Get all plans
// @route   GET /api/plans
exports.getPlans = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const plans = await Plan.find(filter).sort({ createdAt: 1 });
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
