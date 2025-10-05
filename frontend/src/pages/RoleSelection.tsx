import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const RoleSelection: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="role-selection-card">
        <div className="auth-header">
          <h1>Welcome to JobConnect</h1>
          <p>Choose your role to get started</p>
        </div>

        <div className="role-options">
          <div className="role-option">
            <div className="role-icon jobseeker">👤</div>
            <h3>Job Seeker</h3>
            <p>Find your dream job and apply to positions</p>
            <div className="role-actions">
              <Link to="/login/jobseeker" className="auth-button jobseeker">
                Sign In
              </Link>
              <Link to="/register/jobseeker" className="auth-button-outline jobseeker">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="role-option">
            <div className="role-icon employer">🏢</div>
            <h3>Employer</h3>
            <p>Post jobs and find the best talent</p>
            <div className="role-actions">
              <Link to="/login/employer" className="auth-button employer">
                Sign In
              </Link>
              <Link to="/register/employer" className="auth-button-outline employer">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="role-option admin-option">
            <div className="role-icon admin">⚙️</div>
            <h3>Admin</h3>
            <p>Manage the platform and users</p>
            <div className="role-actions">
              <Link to="/login/admin" className="auth-button admin">
                Sign In
              </Link>
              <div className="admin-notice">
                <small>Admin accounts are created by system administrators</small>
              </div>
            </div>
          </div>
        </div>

        <div className="role-selection-footer">
          <p>Already know which role you need?</p>
          <div className="quick-links">
            <Link to="/login/jobseeker">Job Seeker Login</Link>
            <Link to="/login/employer">Employer Login</Link>
            <Link to="/login/admin">Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
