const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n  DFC Health & Harmony Server`);
      console.log(`  ------------------------------`);
      console.log(`  Running on port ${PORT}`);
      console.log(`  http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
