import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../services/api';
import { Job } from '../types';
import './JobDetails.css';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await jobsAPI.getJob(id);
        setJob(response.data.job);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !user) return;

    setApplying(true);
    setApplicationError(null);

    try {
      await applicationsAPI.applyForJob({
        jobId: job._id,
        coverLetter: applicationData.coverLetter,
        resume: applicationData.resume
      });
      
      setShowApplicationForm(false);
      setApplicationData({ coverLetter: '', resume: '' });
      // You could show a success message here
      navigate('/applications');
    } catch (error: any) {
      setApplicationError(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'full-time': '#28a745',
      'part-time': '#17a2b8',
      'contract': '#ffc107',
      'internship': '#6f42c1',
      'remote': '#fd7e14',
    };
    return colors[type] || '#6c757d';
  };

  const getExperienceColor = (experience: string) => {
    const colors: { [key: string]: string } = {
      'entry': '#28a745',
      'mid': '#ffc107',
      'senior': '#dc3545',
      'executive': '#6f42c1',
    };
    return colors[experience] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="job-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-container">
        <div className="error-message">
          <p>{error || 'Job not found'}</p>
          <button onClick={() => navigate('/jobs')} className="btn btn-primary">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <div className="container">
        <div className="job-details-content">
          <div className="job-details-main">
            <div className="job-header">
              <div className="job-title-section">
                <h1>{job.title}</h1>
                <p className="company-name">{job.companyName}</p>
                <div className="job-meta">
                  <span className="job-location">📍 {job.isRemote ? 'Remote' : job.location}</span>
                  <span 
                    className="job-type"
                    style={{ backgroundColor: getJobTypeColor(job.type) }}
                  >
                    {job.type.replace('-', ' ').toUpperCase()}
                  </span>
                  <span 
                    className="experience-level"
                    style={{ color: getExperienceColor(job.requirements.experience) }}
                  >
                    {job.requirements.experience.charAt(0).toUpperCase() + 
                     job.requirements.experience.slice(1)} Level
                  </span>
                </div>
              </div>
              
              <div className="job-actions">
                <button
                  onClick={() => navigate('/jobs')}
                  className="btn btn-outline"
                >
                  ← Back to Jobs
                </button>
                {user?.role === 'jobseeker' && (
                  <button
                    onClick={handleApply}
                    className="btn btn-primary btn-large"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            <div className="job-content">
              <div className="job-section">
                <h3>Job Description</h3>
                <div className="job-description">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="job-section">
                <h3>Requirements</h3>
                <div className="requirements">
                  <div className="requirement-item">
                    <strong>Experience Level:</strong>
                    <span 
                      style={{ color: getExperienceColor(job.requirements.experience) }}
                    >
                      {job.requirements.experience.charAt(0).toUpperCase() + 
                       job.requirements.experience.slice(1)} Level
                    </span>
                  </div>
                  
                  {job.requirements.education && (
                    <div className="requirement-item">
                      <strong>Education:</strong>
                      <span>{job.requirements.education}</span>
                    </div>
                  )}

                  {job.requirements.skills && job.requirements.skills.length > 0 && (
                    <div className="requirement-item">
                      <strong>Required Skills:</strong>
                      <div className="skills-list">
                        {job.requirements.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div className="job-section">
                  <h3>Benefits & Perks</h3>
                  <ul className="benefits-list">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.salary && (job.salary.min || job.salary.max) && (
                <div className="job-section">
                  <h3>Salary</h3>
                  <div className="salary-info">
                    {job.salary.min && job.salary.max
                      ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                      : job.salary.min
                      ? `${job.salary.currency} ${job.salary.min.toLocaleString()}+`
                      : `Up to ${job.salary.currency} ${job.salary.max?.toLocaleString()}`
                    }
                    <span className="salary-period"> per {job.salary.period}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="job-details-sidebar">
            <div className="job-info-card">
              <h3>Job Information</h3>
              <div className="info-item">
                <strong>Category:</strong>
                <span>{job.category}</span>
              </div>
              <div className="info-item">
                <strong>Location:</strong>
                <span>{job.isRemote ? 'Remote' : job.location}</span>
              </div>
              <div className="info-item">
                <strong>Type:</strong>
                <span>{job.type.replace('-', ' ').toUpperCase()}</span>
              </div>
              <div className="info-item">
                <strong>Experience:</strong>
                <span>{job.requirements.experience.charAt(0).toUpperCase() + 
                       job.requirements.experience.slice(1)} Level</span>
              </div>
              <div className="info-item">
                <strong>Application Deadline:</strong>
                <span>{formatDate(job.applicationDeadline)}</span>
              </div>
              <div className="info-item">
                <strong>Applications:</strong>
                <span>{job.applicationCount} applied</span>
              </div>
              <div className="info-item">
                <strong>Views:</strong>
                <span>{job.views} views</span>
              </div>
            </div>

            {user?.role === 'jobseeker' && (
              <div className="application-card">
                <h3>Ready to Apply?</h3>
                <p>Submit your application for this position</p>
                <button
                  onClick={handleApply}
                  className="btn btn-primary btn-large"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>

        {showApplicationForm && (
          <div className="application-modal">
            <div className="application-modal-content">
              <div className="modal-header">
                <h3>Apply for {job.title}</h3>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="close-button"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleApplicationSubmit} className="application-form">
                {applicationError && (
                  <div className="error-message">
                    {applicationError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="coverLetter">Cover Letter (Optional)</label>
                  <textarea
                    id="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                    placeholder="Tell the employer why you're interested in this position..."
                    rows={6}
                    disabled={applying}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="resume">Resume URL *</label>
                  <input
                    type="url"
                    id="resume"
                    value={applicationData.resume}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, resume: e.target.value }))}
                    placeholder="https://example.com/your-resume.pdf"
                    required
                    disabled={applying}
                  />
                  <small>Upload your resume to a file sharing service and paste the link here</small>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="btn btn-outline"
                    disabled={applying}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={applying}
                  >
                    {applying ? 'Applying...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
