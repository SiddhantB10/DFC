const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'age', 'height', 'weight', 'goalWeight', 'gender', 'fitnessLevel'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters and include uppercase and lowercase letters'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = user.getSignedJwtToken();

    res.json({ success: true, message: 'Password updated successfully', token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
};

// @desc    Get user stats (for dashboard)
// @route   GET /api/users/stats
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const Order = require('../models/Order');

    const totalOrders = await Order.countDocuments({ user: req.user._id });
    const activeSubscription = await Order.findOne({
      user: req.user._id,
      status: 'active',
      paymentStatus: 'paid',
      endDate: { $gte: new Date() }
    }).populate('plan', 'name category icon');

    const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
    const weightDiff = user.weight - user.goalWeight;

    res.json({
      success: true,
      stats: {
        bmi: parseFloat(bmi),
        currentWeight: user.weight,
        goalWeight: user.goalWeight,
        weightToGoal: Math.abs(weightDiff),
        direction: weightDiff > 0 ? 'lose' : weightDiff < 0 ? 'gain' : 'maintain',
        totalOrders,
        activeSubscription,
        fitnessLevel: user.fitnessLevel,
        memberSince: user.createdAt,
        loyaltyPoints: user.loyaltyPoints || 0,
        totalPointsEarned: user.totalPointsEarned || 0,
        totalPointsRedeemed: user.totalPointsRedeemed || 0,
        referralCode: user.referralCode || '',
        referralCount: user.referralCount || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};
