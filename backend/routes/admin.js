const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardSummary,
  getAllOrders,
  getAllUsers,
  getAllContacts,
  updateContactStatus,
  getSalesReport
} = require('../controllers/adminController');

router.use(protect, admin);

router.get('/dashboard', getDashboardSummary);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
router.get('/contacts', getAllContacts);
router.put('/contacts/:id/status', updateContactStatus);
router.get('/reports/sales', getSalesReport);

module.exports = router;
