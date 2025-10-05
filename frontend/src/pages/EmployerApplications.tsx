import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import { Application } from '../types';
import './Applications.css';

const EmployerApplications: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchApplications = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching applications for employer:', user?.email);
      const response = await applicationsAPI.getApplications(filters);
      console.log('Applications response:', response.data);
      setApplications(response.data.applications);
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'employer') {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [fetchApplications, isAuthenticated, user]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, { 
        status: newStatus,
        notes: `Status updated to ${newStatus}`
      });
      
      // Refresh applications
      await fetchApplications();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': '#ffc107',
      'reviewed': '#17a2b8',
      'shortlisted': '#28a745',
      'rejected': '#dc3545',
      'accepted': '#007bff'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="applications-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'employer') {
    return (
      <div className="applications-container">
        <div className="container">
          <div className="applications-header">
            <h1>Manage Applications</h1>
            <p>This page is only accessible to employers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="container">
        <div className="applications-header">
          <h1>Manage Applications</h1>
          <p>Review and manage job applications</p>
        </div>

        <div className="applications-content">
          <div className="applications-filters">
            <div className="filter-group">
              <label htmlFor="status-filter">Filter by Status</label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="filter-select"
              >
                <option value="">All Applications</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchApplications} className="btn btn-primary btn-sm">
                Try Again
              </button>
            </div>
          )}

          {applications.length === 0 && !loading && !error ? (
            <div className="no-applications">
              <div className="no-applications-icon">📝</div>
              <h3>No applications found</h3>
              <p>No applications have been submitted for your jobs yet.</p>
              <Link to="/create-job" className="btn btn-primary">
                Post a Job
              </Link>
            </div>
          ) : (
            <>
              <div className="applications-list">
                {applications.map((application) => (
                  <div key={application._id} className="application-card">
                    <div className="application-header">
                      <div className="job-info">
                        <h3>
                          <Link to={`/jobs/${application.job._id}`}>
                            {application.job.title}
                          </Link>
                        </h3>
                        <p className="company-name">{application.job.companyName}</p>
                        <div className="job-details">
                          <span className="job-location">📍 {application.job.location}</span>
                          <span className="job-type">💼 {application.job.type}</span>
                        </div>
                        <div className="applicant-info">
                          <h4>Applicant: {application.applicant.name}</h4>
                          <p>Email: {application.applicant.email}</p>
                        </div>
                      </div>
                      <div className="application-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(application.status) }}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="application-body">
                      <div className="application-meta">
                        <div className="meta-item">
                          <span className="meta-label">Applied:</span>
                          <span className="meta-value">{formatDate(application.appliedAt)}</span>
                        </div>
                        {application.reviewedAt && (
                          <div className="meta-item">
                            <span className="meta-label">Reviewed:</span>
                            <span className="meta-value">{formatDate(application.reviewedAt)}</span>
                          </div>
                        )}
                      </div>

                      {application.coverLetter && (
                        <div className="cover-letter">
                          <h4>Cover Letter</h4>
                          <p>{application.coverLetter}</p>
                        </div>
                      )}

                      {application.notes && (
                        <div className="employer-notes">
                          <h4>Notes</h4>
                          <p>{application.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="application-actions">
                      <Link 
                        to={`/jobs/${application.job._id}`} 
                        className="btn btn-outline btn-sm"
                      >
                        View Job
                      </Link>
                      
                      <Link 
                        to={`/profile/${application.applicant._id}`} 
                        className="btn btn-info btn-sm"
                      >
                        View Profile
                      </Link>
                      
                      {application.resume && (
                        <a 
                          href={application.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-success btn-sm"
                        >
                          View Resume
                        </a>
                      )}
                      
                      <div className="status-actions">
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'reviewed')}
                          className="btn btn-info btn-sm"
                          disabled={application.status === 'reviewed'}
                        >
                          Mark as Reviewed
                        </button>
                        
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                          className="btn btn-success btn-sm"
                          disabled={application.status === 'shortlisted'}
                        >
                          Shortlist
                        </button>
                        
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'accepted')}
                          className="btn btn-primary btn-sm"
                          disabled={application.status === 'accepted'}
                        >
                          Accept
                        </button>
                        
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'rejected')}
                          className="btn btn-danger btn-sm"
                          disabled={application.status === 'rejected'}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  <div className="pagination-pages">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        const current = pagination.currentPage;
                        const total = pagination.totalPages;
                        return (
                          page === 1 ||
                          page === total ||
                          (page >= current - 2 && page <= current + 2)
                        );
                      })
                      .map((page, index, array) => {
                        const showEllipsis = index > 0 && page - array[index - 1] > 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && <span className="pagination-ellipsis">...</span>}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`pagination-btn ${
                                page === pagination.currentPage ? 'active' : ''
                              }`}
                              disabled={loading}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerApplications;
