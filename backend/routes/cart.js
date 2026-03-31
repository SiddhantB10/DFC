const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyCart, addToCart, removeCartItem, clearCart } = require('../controllers/cartController');

router.use(protect);

router.get('/', getMyCart);
router.post('/', addToCart);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
