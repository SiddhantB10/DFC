const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dfc.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminPhone = process.env.ADMIN_PHONE || '9999999999';

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
      }
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    await User.create({
      name: 'DFC Admin',
      email: adminEmail,
      password: adminPassword,
      phone: adminPhone,
      age: 28,
      gender: 'other',
      height: 170,
      weight: 70,
      goalWeight: 68,
      fitnessLevel: 'intermediate',
      role: 'admin'
    });

    console.log(`Admin created: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Admin seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
