const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('jobseeker'), [
  body('jobId').isMongoId().withMessage('Valid job ID is required'),
  body('coverLetter').optional().trim().isLength({ max: 1000 }).withMessage('Cover letter cannot exceed 1000 characters'),
  body('resume').notEmpty().withMessage('Resume is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { jobId, coverLetter, resume, additionalDocuments } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ message: 'Job is no longer accepting applications' });
    }

    if (new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume,
      additionalDocuments: additionalDocuments || []
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    await application.populate([
      { path: 'job', select: 'title companyName location type' },
      { path: 'applicant', select: 'name email profile' }
    ]);

    res.status(201).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Server error applying for job' });
  }
});

router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().custom((value) => {
    if (value === '' || value === undefined || value === null) {
      return true; 
    }
    return ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'].includes(value);
  }).withMessage('Invalid status value')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    console.log('Getting applications for user:', req.user.email, 'Role:', req.user.role);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    if (req.user.role === 'jobseeker') {
      filter.applicant = req.user._id;
    } else if (req.user.role === 'employer') {
      
      const userJobs = await Job.find({ company: req.user._id }).select('_id');
      const jobIds = userJobs.map(job => job._id);
      filter.job = { $in: jobIds };
    }

    if (req.query.status && req.query.status !== '') {
      filter.status = req.query.status;
    }

    console.log('Filter:', filter);

    const applications = await Application.find(filter)
      .populate([
        { 
          path: 'job', 
          select: 'title companyName location type applicationDeadline isActive',
          populate: { path: 'company', select: 'name company.name company.logo' }
        },
        { path: 'applicant', select: 'name email profile' }
      ])
      .select('status coverLetter resume additionalDocuments notes appliedAt reviewedAt')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(filter);

    console.log('Found applications:', applications.length, 'Total:', total);

    res.json({
      success: true,
      applications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate([
        { 
          path: 'job', 
          select: 'title companyName location type description requirements',
          populate: { path: 'company', select: 'name company.name company.logo company.description' }
        },
        { path: 'applicant', select: 'name email profile' }
      ])
      .select('status coverLetter resume additionalDocuments notes appliedAt reviewedAt');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const hasAccess = 
      application.applicant._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin' ||
      (req.user.role === 'employer' && application.job.company._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error fetching application' });
  }
});

router.put('/:id/status', protect, authorize('employer', 'admin'), [
  body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (req.user.role === 'employer') {
      const job = await Job.findById(application.job);
      if (job.company.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this application' });
      }
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes,
        reviewedAt: new Date(),
        reviewedBy: req.user._id
      },
      { new: true }
    ).populate([
      { path: 'job', select: 'title companyName' },
      { path: 'applicant', select: 'name email' }
    ]);

    res.json({
      success: true,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
});

router.get('/job/:jobId', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email profile')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error fetching job applications' });
  }
});

router.delete('/:id', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    await Application.findByIdAndDelete(req.params.id);

    await Job.findByIdAndUpdate(application.job, { $inc: { applicationCount: -1 } });

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error withdrawing application' });
  }
});

module.exports = router;
