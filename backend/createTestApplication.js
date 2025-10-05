const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Find a job seeker user
  const jobSeeker = await User.findOne({ role: 'jobseeker' });
  if (!jobSeeker) {
    console.log('No job seeker found');
    process.exit(0);
  }
  
  // Find a job
  const job = await Job.findOne({ isActive: true });
  if (!job) {
    console.log('No active jobs found');
    process.exit(0);
  }
  
  // Check if application already exists
  const existingApp = await Application.findOne({
    job: job._id,
    applicant: jobSeeker._id
  });
  
  if (existingApp) {
    console.log('Application already exists for this user and job');
    console.log('Application ID:', existingApp._id);
  } else {
    // Create a test application
    const application = await Application.create({
      job: job._id,
      applicant: jobSeeker._id,
      coverLetter: 'I am very interested in this position and believe I would be a great fit for your team.',
      resume: 'test-resume.pdf',
      status: 'pending'
    });
    
    console.log('Test application created successfully:');
    console.log('Application ID:', application._id);
    console.log('Job:', job.title);
    console.log('Applicant:', jobSeeker.name);
  }
  
  // Show all applications for this user
  const applications = await Application.find({ applicant: jobSeeker._id })
    .populate('job', 'title companyName')
    .populate('applicant', 'name email');
  
  console.log('\nAll applications for', jobSeeker.name, ':');
  applications.forEach(app => {
    console.log(`- ${app.job.title} at ${app.job.companyName} (Status: ${app.status})`);
  });
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
