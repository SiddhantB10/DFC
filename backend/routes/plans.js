const express = require('express');
const router = express.Router();
const { getPlans, getPlan, createPlan, updatePlan, getRecommendedPlans } = require('../controllers/planController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getPlans);
router.get('/recommended/me', protect, getRecommendedPlans);
router.get('/:slug', getPlan);
router.post('/', protect, admin, createPlan);
router.put('/:id', protect, admin, updatePlan);

module.exports = router;
