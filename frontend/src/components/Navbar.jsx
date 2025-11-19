import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">JobConnect</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/jobs" className="navbar-link">
            Jobs
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              {user?.role === 'jobseeker' && (
                <Link to="/applications" className="navbar-link">
                  My Applications
                </Link>
              )}
                  {user?.role === 'employer' && (
                    <>
                      <Link to="/create-job" className="navbar-link">
                        Post Job
                      </Link>
                      <Link to="/manage-applications" className="navbar-link">
                        Manage Applications
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin/users" className="navbar-link">
                      Admin Users
                    </Link>
                  )}
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="navbar-button logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="navbar-link">
                Login
              </Link>
              <Link to="/auth" className="navbar-button register-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="navbar-mobile">
          <button 
            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link to="/jobs" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
          Jobs
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            {user?.role === 'jobseeker' && (
              <Link to="/applications" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                My Applications
              </Link>
            )}
                {user?.role === 'employer' && (
                  <>
                    <Link to="/create-job" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                      Post Job
                    </Link>
                    <Link to="/manage-applications" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                      Manage Applications
                    </Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin/users" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Admin Users
                  </Link>
                )}
            <Link to="/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
            <button onClick={handleLogout} className="mobile-button logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link to="/auth" className="mobile-button register-btn" onClick={() => setIsMenuOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
