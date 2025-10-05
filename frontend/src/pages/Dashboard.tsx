import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import './Dashboard.css';

interface DashboardData {
  // Job Seeker fields
  totalApplications?: number;
  pendingApplications?: number;
  shortlistedApplications?: number;
  recentApplications?: any[];
  
  // Employer fields
  totalJobs?: number;
  activeJobs?: number;
  recentJobs?: any[];
  
  // Admin fields
  totalUsers?: number;
  recentUsers?: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getDashboard();
        setDashboardData(response.data.dashboard);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your {user?.role === 'jobseeker' ? 'job search' : 'job postings'}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {user?.role === 'jobseeker' && (
            <div className="jobseeker-dashboard">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-content">
                    <h3>{dashboardData.totalApplications || 0}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-content">
                    <h3>{dashboardData.pendingApplications || 0}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3>{dashboardData.shortlistedApplications || 0}</h3>
                    <p>Shortlisted</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-sections">
                <div className="section">
                  <div className="section-header">
                    <h2>Recent Applications</h2>
                    <Link to="/applications" className="btn btn-outline btn-sm">
                      View All
                    </Link>
                  </div>
                  <div className="section-content">
                    {dashboardData.recentApplications && dashboardData.recentApplications.length > 0 ? (
                      <div className="applications-list">
                        {dashboardData.recentApplications.map((application: any) => (
                          <div key={application._id} className="application-item">
                            <div className="application-info">
                              <h4>{application.job?.title}</h4>
                              <p>{application.job?.companyName}</p>
                            </div>
                            <div className="application-status">
                              <span className={`status-badge status-${application.status}`}>
                                {application.status}
                              </span>
                              {application.resume && (
                                <a
                                  href={application.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline btn-sm"
                                >
                                  View Resume
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No applications yet. <Link to="/jobs">Start applying!</Link></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'employer' && (
            <div className="employer-dashboard">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💼</div>
                  <div className="stat-content">
                    <h3>{dashboardData.totalJobs || 0}</h3>
                    <p>Total Jobs</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h3>{dashboardData.activeJobs || 0}</h3>
                    <p>Active Jobs</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <h3>{dashboardData.totalApplications || 0}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-sections">
                <div className="section">
                  <div className="section-header">
                    <h2>Recent Jobs</h2>
                    <Link to="/create-job" className="btn btn-primary btn-sm">
                      Post New Job
                    </Link>
                  </div>
                  <div className="section-content">
                    {dashboardData.recentJobs && dashboardData.recentJobs.length > 0 ? (
                      <div className="jobs-list">
                        {dashboardData.recentJobs.map((job: any) => (
                          <div key={job._id} className="job-item">
                            <div className="job-info">
                              <h4>{job.title}</h4>
                              <p>{job.location} • {job.type}</p>
                            </div>
                            <div className="job-stats">
                              <span>{job.applicationCount} applications</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No jobs posted yet. <Link to="/create-job">Post your first job!</Link></p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                    <h2>Recent Applications</h2>
                  </div>
                  <div className="section-content">
                    {dashboardData.recentApplications && dashboardData.recentApplications.length > 0 ? (
                      <div className="applications-list">
                        {dashboardData.recentApplications.map((application: any) => (
                          <div key={application._id} className="application-item">
                            <div className="application-info">
                              <h4>{application.applicant?.name}</h4>
                              <p>{application.job?.title}</p>
                            </div>
                            <div className="application-status">
                              <span className={`status-badge status-${application.status}`}>
                                {application.status}
                              </span>
                              {application.applicant?._id && (
                                <Link to={`/profile/${application.applicant._id}`} className="btn btn-outline btn-sm">
                                  View Profile
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No applications yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'admin' && (
            <div className="admin-dashboard">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>{dashboardData.totalUsers || 0}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💼</div>
                  <div className="stat-content">
                    <h3>{dashboardData.totalJobs || 0}</h3>
                    <p>Total Jobs</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <h3>{dashboardData.totalApplications || 0}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-sections">
                <div className="section">
                  <div className="section-header">
                    <h2>Recent Users</h2>
                  </div>
                  <div className="section-content">
                    {dashboardData.recentUsers && dashboardData.recentUsers.length > 0 ? (
                      <div className="users-list">
                        {dashboardData.recentUsers.map((user: any) => (
                          <div key={user._id} className="user-item">
                            <div className="user-info">
                              <h4>{user.name}</h4>
                              <p>{user.email} • {user.role}</p>
                            </div>
                            <div className="user-status">
                              <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No users found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
