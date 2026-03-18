const express = require('express');
const router = express.Router();
const {
	createCheckoutOrder,
	verifyPayment,
	markPaymentFailed,
	markPaymentCancelled,
	getMyOrders,
	getOrder,
	getActiveSubscription,
	getInvoiceByOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/checkout', createCheckoutOrder);
router.post('/verify-payment', verifyPayment);
router.post('/payment-failed', markPaymentFailed);
router.post('/payment-cancelled', markPaymentCancelled);
router.get('/', getMyOrders);
router.get('/active', getActiveSubscription);
router.get('/:id/invoice', getInvoiceByOrder);
router.get('/:id', getOrder);

module.exports = router;
