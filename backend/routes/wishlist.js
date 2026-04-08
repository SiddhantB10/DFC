const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWishlist, addToWishlist, removeFromWishlist, removeFromWishlistByPlanId } = require('../controllers/wishlistController');

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:id', (req, res, next) => {
  // Check if query parameter 'type' is provided
  if (req.query.type) {
    removeFromWishlist(req, res, next);
  } else {
    // Backward compatibility: treat as planId
    removeFromWishlistByPlanId(req, res, next);
  }
});

module.exports = router;
