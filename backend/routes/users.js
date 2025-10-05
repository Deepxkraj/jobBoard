const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('profile.phone').optional().trim(),
  body('profile.location').optional().trim(),
  body('profile.bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('profile.skills').optional().isArray().withMessage('Skills must be an array'),
  body('company.name').optional().trim().isLength({ min: 2 }).withMessage('Company name must be at least 2 characters'),
  body('company.website').optional().isURL().withMessage('Please provide a valid website URL'),
  body('company.description').optional().trim().isLength({ max: 1000 }).withMessage('Company description cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const updateData = { ...req.body };

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.role;
    delete updateData.isActive;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    let dashboardData = {};

    if (req.user.role === 'jobseeker') {
      // Job seeker dashboard
      const totalApplications = await Application.countDocuments({ applicant: req.user._id });
      const pendingApplications = await Application.countDocuments({ 
        applicant: req.user._id, 
        status: 'pending' 
      });
      const shortlistedApplications = await Application.countDocuments({ 
        applicant: req.user._id, 
        status: 'shortlisted' 
      });
      const recentApplications = await Application.find({ applicant: req.user._id })
        .populate('job', 'title companyName location type')
        .sort({ appliedAt: -1 })
        .limit(5);

      dashboardData = {
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        recentApplications
      };
    } else if (req.user.role === 'employer') {
      // Employer dashboard
      const totalJobs = await Job.countDocuments({ company: req.user._id });
      const activeJobs = await Job.countDocuments({ 
        company: req.user._id, 
        isActive: true 
      });
      const totalApplications = await Application.countDocuments({
        job: { $in: await Job.find({ company: req.user._id }).select('_id') }
      });
      const recentJobs = await Job.find({ company: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);
      const recentApplications = await Application.find({
        job: { $in: await Job.find({ company: req.user._id }).select('_id') }
      })
        .populate('applicant', 'name email')
        .populate('job', 'title')
        .sort({ appliedAt: -1 })
        .limit(5);

      dashboardData = {
        totalJobs,
        activeJobs,
        totalApplications,
        recentJobs,
        recentApplications
      };
    } else if (req.user.role === 'admin') {
      // Admin dashboard
      const totalUsers = await User.countDocuments();
      const totalJobs = await Job.countDocuments();
      const totalApplications = await Application.countDocuments();
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role createdAt');
      const recentJobs = await Job.find()
        .populate('company', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

      dashboardData = {
        totalUsers,
        totalJobs,
        totalApplications,
        recentUsers,
        recentJobs
      };
    }

    res.json({
      success: true,
      dashboard: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name profile company role createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If it's an employer, also get their jobs
    let jobs = [];
    if (user.role === 'employer') {
      jobs = await Job.find({ 
        company: user._id, 
        isActive: true 
      }).select('title location type createdAt').limit(5);
    }

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        jobs
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (admin only)
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('admin'), [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

module.exports = router;
