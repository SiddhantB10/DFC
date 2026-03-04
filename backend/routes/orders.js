const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, getActiveSubscription } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/active', getActiveSubscription);
router.get('/:id', getOrder);

module.exports = router;
