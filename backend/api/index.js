const path = require('path');
const dotenv = require('dotenv');
const app = require('../app');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Check MongoDB and environment variables.'
    });
  }
};
