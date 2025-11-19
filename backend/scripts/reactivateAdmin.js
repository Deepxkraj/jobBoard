const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobconnect';
const adminEmail = process.argv[2] || 'admin@jobconnect.com';

const reactivateAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      { isActive: true },
      { new: true }
    );

    if (!adminUser) {
      console.log(`No admin found with email: ${adminEmail}`);
      process.exit(1);
    }

    console.log(`Admin account reactivated: ${adminUser.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error reactivating admin user:', error);
    process.exit(1);
  }
};

reactivateAdmin();

