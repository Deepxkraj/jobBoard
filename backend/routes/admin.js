const express = require('express');
const { query, body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const router = express.Router();

// All routes here require admin
router.use(protect, authorize('admin'));

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [users, jobs, applications, activeUsers] = await Promise.all([
      User.countDocuments({}),
      Job.countDocuments({}),
      Application.countDocuments({}),
      User.countDocuments({ isActive: true })
    ]);

    res.json({
      success: true,
      stats: { users, jobs, applications, activeUsers }
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to get stats' });
  }
});

// GET /api/admin/users
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['jobseeker', 'employer', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    res.json({ success: true, users, pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total, hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 } });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', [ body('isActive').isBoolean() ], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const updated = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user: updated });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

// GET /api/admin/jobs
router.get('/jobs', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments({})
    ]);

    res.json({ success: true, jobs, pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total, hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 } });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// PUT /api/admin/jobs/:id/moderate (approve/reject toggle isActive)
router.put('/jobs/:id/moderate', [ body('isActive').isBoolean() ], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

    const job = await Job.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, job });
  } catch (e) {
    res.status(500).json({ message: 'Failed to moderate job' });
  }
});

module.exports = router;



