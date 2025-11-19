import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import './CreateJob.css';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    category: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly'
    },
    requirements: {
      experience: 'entry',
      skills: [],
      education: ''
    },
    benefits: [],
    applicationDeadline: '',
    isRemote: false
  });

  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }));
    } else if (name.startsWith('requirements.')) {
      const reqField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [reqField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.requirements.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          skills: [...prev.requirements.skills, skillInput.trim()]
        }
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills: prev.requirements.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (benefitToRemove) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.title.trim()) newErrors.push('Job title is required');
    if (formData.title.trim().length < 5) newErrors.push('Job title must be at least 5 characters');
    if (formData.title.trim().length > 100) newErrors.push('Job title cannot exceed 100 characters');
    
    if (!formData.description.trim()) newErrors.push('Job description is required');
    if (formData.description.trim().length < 50) newErrors.push('Job description must be at least 50 characters');
    if (formData.description.trim().length > 2000) newErrors.push('Job description cannot exceed 2000 characters');
    
    if (!formData.location.trim()) newErrors.push('Location is required');
    if (!formData.category.trim()) newErrors.push('Category is required');
    if (!formData.applicationDeadline) newErrors.push('Application deadline is required');
    
    if (formData.salary.min && formData.salary.max && 
        parseInt(formData.salary.min) > parseInt(formData.salary.max)) {
      newErrors.push('Minimum salary cannot be greater than maximum salary');
    }

    if (formData.applicationDeadline) {
      const deadlineDate = new Date(formData.applicationDeadline);
      const now = new Date();
      
      if (deadlineDate <= now) {
        newErrors.push('Application deadline must be in the future');
      }

      if (isNaN(deadlineDate.getTime())) {
        newErrors.push('Please enter a valid application deadline');
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const jobData = {
        ...formData,
        salary: {
          ...formData.salary,
          min: formData.salary.min ? parseInt(formData.salary.min) : undefined,
          max: formData.salary.max ? parseInt(formData.salary.max) : undefined
        },
        
        applicationDeadline: new Date(formData.applicationDeadline).toISOString()
      };

      await jobsAPI.createJob(jobData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Job creation error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map((err) => err.msg));
      } else {
        setErrors([error.response?.data?.message || 'Failed to create job']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-container">
      <div className="container">
        <div className="create-job-header">
          <h1>Post a New Job</h1>
          <p>Fill out the form below to create a new job posting</p>
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                {error}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-job-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  <option value="technology">Technology</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="design">Design</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="engineering">Engineering</option>
                  <option value="operations">Operations</option>
                  <option value="human-resources">Human Resources</option>
                  <option value="customer-service">Customer Service</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={6}
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Job Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                This is a remote position
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Salary Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salary.min">Minimum Salary</label>
                <input
                  type="number"
                  id="salary.min"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary.max">Maximum Salary</label>
                <input
                  type="number"
                  id="salary.max"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  placeholder="e.g., 80000"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salary.currency">Currency</label>
                <select
                  id="salary.currency"
                  name="salary.currency"
                  value={formData.salary.currency}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salary.period">Period</label>
                <select
                  id="salary.period"
                  name="salary.period"
                  value={formData.salary.period}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="yearly">Per Year</option>
                  <option value="monthly">Per Month</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Requirements</h3>
            
            <div className="form-group">
              <label htmlFor="requirements.experience">Experience Level *</label>
              <select
                id="requirements.experience"
                name="requirements.experience"
                value={formData.requirements.experience}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6+ years)</option>
                <option value="executive">Executive Level</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requirements.education">Education Requirements</label>
              <input
                type="text"
                id="requirements.education"
                name="requirements.education"
                value={formData.requirements.education}
                onChange={handleChange}
                placeholder="e.g., Bachelor's degree in Computer Science"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Required Skills</label>
              <div className="skill-input-container">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} disabled={loading}>
                  Add
                </button>
              </div>
              <div className="skills-list">
                {formData.requirements.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Benefits & Perks</h3>
            
            <div className="form-group">
              <label>Benefits</label>
              <div className="benefit-input-container">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="Add a benefit"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <button type="button" onClick={addBenefit} disabled={loading}>
                  Add
                </button>
              </div>
              <div className="benefits-list">
                {formData.benefits.map((benefit, index) => (
                  <span key={index} className="benefit-tag">
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Application Details</h3>
            
            <div className="form-group">
              <label htmlFor="applicationDeadline">Application Deadline *</label>
              <input
                type="datetime-local"
                id="applicationDeadline"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Job...' : 'Create Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
