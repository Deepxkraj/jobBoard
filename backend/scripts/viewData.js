const mongoose = require('mongoose');
require('dotenv').config();

const ATLAS_URI = process.env.MONGODB_URI;

async function viewData() {
  try {
    console.log('📡 Connecting to MongoDB Atlas...\n');
    await mongoose.connect(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB Atlas!\n');
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    console.log('='.repeat(60));
    console.log('📊 DATABASE SUMMARY');
    console.log('='.repeat(60));
    console.log(`Database: ${db.databaseName}`);
    console.log(`Collections: ${collections.length}\n`);
    
    for (const colInfo of collections) {
      const collection = db.collection(colInfo.name);
      const count = await collection.countDocuments();
      
      console.log('─'.repeat(60));
      console.log(`📦 Collection: ${colInfo.name}`);
      console.log(`   Documents: ${count}`);
      
      if (count > 0) {
        // Show first few documents as sample
        const samples = await collection.find({}).limit(3).toArray();
        console.log(`\n   Sample documents (showing first ${Math.min(3, count)}):`);
        
        samples.forEach((doc, index) => {
          console.log(`\n   [${index + 1}]`);
          // Format the document nicely
          const formatted = JSON.stringify(doc, null, 2)
            .split('\n')
            .map(line => '   ' + line)
            .join('\n');
          console.log(formatted);
        });
        
        if (count > 3) {
          console.log(`\n   ... and ${count - 3} more documents`);
        }
      }
      console.log('');
    }
    
    // Show specific collection details
    console.log('='.repeat(60));
    console.log('📋 COLLECTION DETAILS');
    console.log('='.repeat(60));
    
    // Users collection
    if (collections.find(c => c.name === 'users')) {
      const users = db.collection('users');
      const userCount = await users.countDocuments();
      const activeUsers = await users.countDocuments({ isActive: true });
      const admins = await users.countDocuments({ role: 'admin' });
      const employers = await users.countDocuments({ role: 'employer' });
      const jobSeekers = await users.countDocuments({ role: 'jobseeker' });
      
      console.log('\n👥 USERS:');
      console.log(`   Total: ${userCount}`);
      console.log(`   Active: ${activeUsers}`);
      console.log(`   Admins: ${admins}`);
      console.log(`   Employers: ${employers}`);
      console.log(`   Job Seekers: ${jobSeekers}`);
    }
    
    // Jobs collection
    if (collections.find(c => c.name === 'jobs')) {
      const jobs = db.collection('jobs');
      const jobCount = await jobs.countDocuments();
      
      console.log('\n💼 JOBS:');
      console.log(`   Total: ${jobCount}`);
    }
    
    // Applications collection
    if (collections.find(c => c.name === 'applications')) {
      const applications = db.collection('applications');
      const appCount = await applications.countDocuments();
      
      console.log('\n📝 APPLICATIONS:');
      console.log(`   Total: ${appCount}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('💡 To view data in Atlas:');
    console.log('   1. Go to: https://cloud.mongodb.com');
    console.log('   2. Click: Database → Browse Collections');
    console.log('   3. Select: jobconnect database');
    console.log('='.repeat(60) + '\n');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

viewData();

