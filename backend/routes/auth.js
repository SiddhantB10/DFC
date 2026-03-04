const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('age').isInt({ min: 14, max: 100 }).withMessage('Age must be between 14 and 100'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender is required'),
  body('height').isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100-250 cm'),
  body('weight').isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30-300 kg'),
  body('goalWeight').isFloat({ min: 30, max: 200 }).withMessage('Goal weight must be between 30-200 kg')
], register);

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
