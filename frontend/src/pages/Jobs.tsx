import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';
import { Job, JobFilters } from '../types';
import JobCard from '../components/JobCard';
import JobFiltersComponent from '../components/JobFilters';
import './Jobs.css';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 12,
  });

  const fetchJobs = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getJobs(filters);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
    });
  };

  if (loading) {
    return (
      <div className="jobs-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <div className="container">
          <h1>Find Your Next Job</h1>
          <p>Discover opportunities that match your skills and interests</p>
        </div>
      </div>

      <div className="jobs-content">
        <div className="container">
          <div className="jobs-layout">
            <div className="jobs-sidebar">
              <JobFiltersComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>

            <div className="jobs-main">
              <div className="jobs-toolbar">
                <div className="jobs-count">
                  {pagination.totalItems > 0 ? (
                    <span>
                      Showing {jobs.length} of {pagination.totalItems} jobs
                    </span>
                  ) : (
                    <span>No jobs found</span>
                  )}
                </div>
                <div className="jobs-actions">
                  <button
                    onClick={clearFilters}
                    className="btn btn-outline btn-sm"
                    disabled={loading}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={fetchJobs} className="btn btn-primary btn-sm">
                    Try Again
                  </button>
                </div>
              )}

              {jobs.length === 0 && !loading && !error ? (
                <div className="no-jobs">
                  <div className="no-jobs-icon">🔍</div>
                  <h3>No jobs found</h3>
                  <p>Try adjusting your search criteria or clear the filters</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="jobs-grid">
                    {jobs.map((job) => (
                      <JobCard key={job._id} job={job} />
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
      </div>
    </div>
  );
};

export default Jobs;
