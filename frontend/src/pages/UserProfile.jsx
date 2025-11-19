import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await usersAPI.getUser(id);
        setProfileUser(response.data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="user-profile-container">
        <div className="container">
          <div className="error-message">
            <h2>User Not Found</h2>
            <p>The requested user profile could not be found.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;
  const isAdminViewingOther = currentUser?.role === 'admin' && !isOwnProfile;

  return (
    <div className="user-profile-container">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileUser.profile?.avatar ? (
              <img 
                src={profileUser.profile.avatar} 
                alt={profileUser.name}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                {profileUser.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h1>{profileUser.name}</h1>
            <p className="profile-email">{profileUser.email}</p>
            <div className="profile-badges">
              <span className={`role-badge ${profileUser.role}`}>
                {profileUser.role.charAt(0).toUpperCase() + profileUser.role.slice(1)}
              </span>
              {profileUser.isActive ? (
                <span className="status-badge active">Active</span>
              ) : (
                <span className="status-badge inactive">Inactive</span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {isOwnProfile ? (
              <Link to="/profile" className="btn btn-primary">
                Edit Profile
              </Link>
            ) : (
              <div className="contact-actions">
                <a 
                  href={`mailto:${profileUser.email}`}
                  className="btn btn-primary"
                >
                  Contact
                </a>
                <Link to={isAdminViewingOther ? "/admin/users" : "/dashboard"} className="btn btn-outline">
                  {isAdminViewingOther ? 'Back to Users' : 'Back to Dashboard'}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sections">
            {/* Personal Information */}
            {profileUser.profile && (
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="info-grid">
                  {profileUser.profile.phone && (
                    <div className="info-item">
                      <label>Phone</label>
                      <span>{profileUser.profile.phone}</span>
                    </div>
                  )}
                  {profileUser.profile.location && (
                    <div className="info-item">
                      <label>Location</label>
                      <span>{profileUser.profile.location}</span>
                    </div>
                  )}
                  {profileUser.profile.dateOfBirth && (
                    <div className="info-item">
                      <label>Date of Birth</label>
                      <span>{formatDate(profileUser.profile.dateOfBirth)}</span>
                    </div>
                  )}
                  {profileUser.profile.gender && (
                    <div className="info-item">
                      <label>Gender</label>
                      <span>{profileUser.profile.gender}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Information */}
            {profileUser.profile?.professional && (
              <div className="profile-section">
                <h2>Professional Information</h2>
                <div className="info-grid">
                  {profileUser.profile.professional.title && (
                    <div className="info-item">
                      <label>Job Title</label>
                      <span>{profileUser.profile.professional.title}</span>
                    </div>
                  )}
                  {profileUser.profile.professional.experience && (
                    <div className="info-item">
                      <label>Experience</label>
                      <span>{profileUser.profile.professional.experience}</span>
                    </div>
                  )}
                  {profileUser.profile.professional.skills && profileUser.profile.professional.skills.length > 0 && (
                    <div className="info-item full-width">
                      <label>Skills</label>
                      <div className="skills-list">
                        {profileUser.profile.professional.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profileUser.profile.professional.education && (
                    <div className="info-item full-width">
                      <label>Education</label>
                      <span>{profileUser.profile.professional.education}</span>
                    </div>
                  )}
                  {profileUser.profile.professional.bio && (
                    <div className="info-item full-width">
                      <label>Bio</label>
                      <p className="bio-text">{profileUser.profile.professional.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Information (for employers) */}
            {profileUser.company && (
              <div className="profile-section">
                <h2>Company Information</h2>
                <div className="info-grid">
                  {profileUser.company.name && (
                    <div className="info-item">
                      <label>Company Name</label>
                      <span>{profileUser.company.name}</span>
                    </div>
                  )}
                  {profileUser.company.website && (
                    <div className="info-item">
                      <label>Website</label>
                      <a 
                        href={profileUser.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {profileUser.company.website}
                      </a>
                    </div>
                  )}
                  {profileUser.company.size && (
                    <div className="info-item">
                      <label>Company Size</label>
                      <span>{profileUser.company.size}</span>
                    </div>
                  )}
                  {profileUser.company.industry && (
                    <div className="info-item">
                      <label>Industry</label>
                      <span>{profileUser.company.industry}</span>
                    </div>
                  )}
                  {profileUser.company.description && (
                    <div className="info-item full-width">
                      <label>Company Description</label>
                      <p className="bio-text">{profileUser.company.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {profileUser.profile?.social && (
              <div className="profile-section">
                <h2>Social Links</h2>
                <div className="social-links">
                  {profileUser.profile.social.linkedin && (
                    <a 
                      href={profileUser.profile.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                    >
                      LinkedIn
                    </a>
                  )}
                  {profileUser.profile.social.github && (
                    <a 
                      href={profileUser.profile.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link github"
                    >
                      GitHub
                    </a>
                  )}
                  {profileUser.profile.social.portfolio && (
                    <a 
                      href={profileUser.profile.social.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link portfolio"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Resume */}
            {profileUser.profile?.resume && (
              <div className="profile-section">
                <h2>Resume</h2>
                <div className="resume-section">
                  <a 
                    href={profileUser.profile.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary resume-download"
                  >
                    📄 Download Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
