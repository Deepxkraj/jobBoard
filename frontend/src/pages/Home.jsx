import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Dream Job or
              <span className="highlight"> Hire Top Talent</span>
            </h1>
            <p className="hero-description">
              Connect with the best opportunities and candidates in the market. 
              JobConnect makes it easy to find your next career move or build your dream team.
            </p>
            <div className="hero-buttons">
              {!isAuthenticated ? (
                <>
                  <Link to="/register?role=jobseeker" className="btn btn-primary">
                    Find Jobs
                  </Link>
                  <Link to="/register?role=employer" className="btn btn-secondary">
                    Post Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                  {user?.role === 'employer' && (
                    <Link to="/create-job" className="btn btn-secondary">
                      Post a Job
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="illustration-card card-1">
                <div className="card-icon">💼</div>
                <div className="card-text">Find Jobs</div>
              </div>
              <div className="illustration-card card-2">
                <div className="card-icon">🏢</div>
                <div className="card-text">Hire Talent</div>
              </div>
              <div className="illustration-card card-3">
                <div className="card-icon">🤝</div>
                <div className="card-text">Connect</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose JobConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Advanced filtering and search capabilities to find exactly what you're looking for.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick Apply</h3>
              <p>Apply to multiple jobs with just a few clicks using your saved profile.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track your applications and job performance with detailed analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Your data is protected with enterprise-grade security measures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>Access JobConnect from any device with our responsive design.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Targeted</h3>
              <p>Get matched with relevant opportunities based on your skills and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Job Seekers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25K+</div>
              <div className="stat-label">Successful Hires</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of professionals who have found their dream jobs or built amazing teams.</p>
            {!isAuthenticated ? (
              <div className="cta-buttons">
                <Link to="/register?role=jobseeker" className="btn btn-primary btn-large">
                  Start Job Hunting
                </Link>
                <Link to="/register?role=employer" className="btn btn-outline btn-large">
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="cta-buttons">
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
