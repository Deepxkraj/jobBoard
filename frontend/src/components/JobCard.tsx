import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import './JobCard.css';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          <h3 className="job-title">
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <p className="company-name">{job.companyName}</p>
        </div>
        <div className="job-type-badge" style={{ backgroundColor: getJobTypeColor(job.type) }}>
          {job.type.replace('-', ' ').toUpperCase()}
        </div>
      </div>

      <div className="job-card-body">
        <p className="job-description">
          {job.description.length > 150 
            ? `${job.description.substring(0, 150)}...` 
            : job.description
          }
        </p>

        <div className="job-details">
          <div className="job-detail">
            <span className="detail-icon">📍</span>
            <span className="detail-text">
              {job.isRemote ? 'Remote' : job.location}
            </span>
          </div>
          
          <div className="job-detail">
            <span className="detail-icon">💼</span>
            <span className="detail-text">{job.category}</span>
          </div>

          <div className="job-detail">
            <span className="detail-icon">🎯</span>
            <span 
              className="detail-text experience-level"
              style={{ color: getExperienceColor(job.requirements.experience) }}
            >
              {job.requirements.experience.charAt(0).toUpperCase() + 
               job.requirements.experience.slice(1)} Level
            </span>
          </div>
        </div>

        {job.salary && (job.salary.min || job.salary.max) && (
          <div className="job-salary">
            <span className="salary-icon">💰</span>
            <span className="salary-text">
              {job.salary.min && job.salary.max
                ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                : job.salary.min
                ? `${job.salary.currency} ${job.salary.min.toLocaleString()}+`
                : `Up to ${job.salary.currency} ${job.salary.max?.toLocaleString()}`
              }
              <span className="salary-period"> per {job.salary.period}</span>
            </span>
          </div>
        )}

        {job.benefits && job.benefits.length > 0 && (
          <div className="job-benefits">
            <div className="benefits-label">Benefits:</div>
            <div className="benefits-list">
              {job.benefits.slice(0, 3).map((benefit, index) => (
                <span key={index} className="benefit-tag">
                  {benefit}
                </span>
              ))}
              {job.benefits.length > 3 && (
                <span className="benefit-tag more">
                  +{job.benefits.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <div className="job-meta">
          <span className="job-views">
            👁️ {job.views} views
          </span>
          <span className="job-applications">
            📝 {job.applicationCount} applications
          </span>
        </div>
        
        <div className="job-deadline">
          <span className="deadline-label">Apply by:</span>
          <span className="deadline-date">
            {formatDate(job.applicationDeadline)}
          </span>
        </div>
      </div>

      <div className="job-card-actions">
        <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
        <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
          Quick Apply
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
