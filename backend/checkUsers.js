const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  const users = await User.find({}, 'name email role');
  console.log('\nExisting users:');
  if (users.length === 0) {
    console.log('No users found in database.');
  } else {
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
  }
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
