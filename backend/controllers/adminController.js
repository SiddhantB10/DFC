const User = require('../models/User');
const Plan = require('../models/Plan');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

const getRangeFilter = (from, to) => {
  const filter = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const [totalUsers, totalPlans, totalOrders, totalContacts, paidOrders, activeSubscriptions] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Plan.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Contact.countDocuments(),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.countDocuments({ status: 'active', paymentStatus: 'paid', endDate: { $gte: new Date() } })
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ]);

    const categorySales = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $lookup: {
          from: 'plans',
          localField: 'plan',
          foreignField: '_id',
          as: 'planData'
        }
      },
      { $unwind: '$planData' },
      {
        $group: {
          _id: '$planData.category',
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('plan', 'name category icon')
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      summary: {
        totalUsers,
        totalPlans,
        totalOrders,
        totalContacts,
        paidOrders,
        activeSubscriptions,
        totalRevenue: revenueAgg[0]?.revenue || 0
      },
      categorySales,
      recentOrders,
      recentContacts
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching admin dashboard' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('plan', 'name category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('name email phone fitnessLevel createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    console.error('Admin contacts error:', error);
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ success: false, message: 'Error updating contact status' });
  }
};

exports.replyToContact = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    contact.adminReply = reply.trim();
    contact.status = 'replied';
    contact.repliedAt = new Date();
    contact.repliedBy = req.user?.email || req.user?.name || 'admin';

    await contact.save();

    res.json({ success: true, message: 'Reply saved successfully', contact });
  } catch (error) {
    console.error('Reply to contact error:', error);
    res.status(500).json({ success: false, message: 'Error saving reply' });
  }
};

exports.updateContactPriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Update contact priority error:', error);
    res.status(500).json({ success: false, message: 'Error updating contact priority' });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = getRangeFilter(from, to);

    const matchStage = {
      paymentStatus: 'paid',
      ...dateFilter
    };

    const [summaryAgg, durationAgg, planAgg, productAgg] = await Promise.all([
      Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
            avgOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]),
      Order.aggregate([
        { $match: { ...matchStage, plan: { $ne: null } } },
        {
          $group: {
            _id: '$duration',
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { revenue: -1 } }
      ]),
      Order.aggregate([
        { $match: { ...matchStage, plan: { $ne: null } } },
        {
          $lookup: {
            from: 'plans',
            localField: 'plan',
            foreignField: '_id',
            as: 'planData'
          }
        },
        { $unwind: '$planData' },
        {
          $group: {
            _id: '$planData.name',
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { revenue: -1 } }
      ]),
      Order.aggregate([
        { $match: { ...matchStage, product: { $ne: null } } },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productData'
          }
        },
        { $unwind: '$productData' },
        {
          $group: {
            _id: '$productData.name',
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { revenue: -1 } }
      ])
    ]);

    res.json({
      success: true,
      range: { from: from || null, to: to || null },
      summary: summaryAgg[0] || { orders: 0, revenue: 0, avgOrderValue: 0 },
      byDuration: durationAgg,
      byPlan: planAgg,
      byProduct: productAgg
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ success: false, message: 'Error generating sales report' });
  }
};
