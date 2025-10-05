const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Create a test user
  const testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'jobseeker',
    isActive: true
  });
  
  console.log('Test user created successfully:');
  console.log('Email: test@example.com');
  console.log('Password: password123');
  console.log('Role: jobseeker');
  
  process.exit(0);
})
.catch(async (err) => {
  if (err.code === 11000) {
    console.log('Test user already exists. Here are the available accounts:');
    const users = await User.find({}, 'name email role');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    process.exit(0);
  } else {
    console.error('Error:', err);
    process.exit(1);
  }
});
