import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { User } from '../types';
import './Profile.css';

const ProfileReadOnly: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'company'>('personal');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await usersAPI.getUser(id as string);
        setProfileUser(res.data.user);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="profile-container">
        <div className="container">
          <div className="error-message">
            <p>{error || 'User not found'}</p>
            <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <h1>Personal Information</h1>
          <p>{profileUser.name} • {profileUser.email}</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-tabs">
              <button
                className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <span className="tab-icon">👤</span>
                <span className="tab-label">Personal Info</span>
              </button>
              <button
                className={`tab-button ${activeTab === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveTab('professional')}
              >
                <span className="tab-icon">💼</span>
                <span className="tab-label">Professional</span>
              </button>
              <button
                className={`tab-button ${activeTab === 'company' ? 'active' : ''}`}
                onClick={() => setActiveTab('company')}
              >
                <span className="tab-icon">🏢</span>
                <span className="tab-label">Company Info</span>
              </button>
            </div>
          </div>

          <div className="profile-main">
            {activeTab === 'personal' && (
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={profileUser.name} disabled />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input value={profileUser.email} disabled />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input value={profileUser.profile?.phone || '-'} disabled />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input value={profileUser.profile?.location || '-'} disabled />
                  </div>
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea value={profileUser.profile?.bio || '-'} disabled rows={3} />
                </div>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="form-section">
                <h3>Professional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Skills</label>
                    <input value={(profileUser.profile?.skills || []).join(', ') || '-'} disabled />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="form-section">
                <h3>Company Information</h3>
                {profileUser.company ? (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Company</label>
                        <input value={profileUser.company.name || '-'} disabled />
                      </div>
                      <div className="form-group">
                        <label>Website</label>
                        <input value={profileUser.company.website || '-'} disabled />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={profileUser.company.description || '-'} disabled rows={3} />
                    </div>
                  </>
                ) : (
                  <p>-</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileReadOnly;
