import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile: {
      phone: '',
      location: '',
      bio: '',
      skills: [],
      experience: [],
      education: []
    },
    company: {
      name: '',
      website: '',
      description: '',
      industry: '',
      size: '',
      location: ''
    }
  });

  const [skillInput, setSkillInput] = useState('');

  const [noExperience, setNoExperience] = useState(false);
  const [experience, setExperience] = useState({
    company: '',
    position: '',
    description: ''
  });

  const [education, setEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    description: ''
  });

  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profile: {
          phone: user.profile?.phone || '',
          location: user.profile?.location || '',
          bio: user.profile?.bio || '',
          skills: user.profile?.skills || [],
          experience: user.profile?.experience || [],
          education: user.profile?.education || []
        },
        company: {
          name: user.company?.name || '',
          website: user.company?.website || '',
          description: user.company?.description || '',
          industry: user.company?.industry || '',
          size: user.company?.size || '',
          location: user.company?.location || ''
        }
      });

      const exp0 = user.profile?.experience?.[0] || { company: '', position: '', description: '' };
      const edu0 = user.profile?.education?.[0] || { institution: '', degree: '', field: '', description: '' };

      setExperience({
        company: exp0.company || '',
        position: exp0.position || '',
        description: exp0.description || ''
      });
      setEducation({
        institution: edu0.institution || '',
        degree: edu0.degree || '',
        field: edu0.field || '',
        description: edu0.description || ''
      });
      setNoExperience(!(user.profile?.experience && user.profile.experience.length > 0));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          [companyField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.profile.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, skillInput.trim()]
        }
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        profile: {
          ...formData.profile,
          experience: noExperience
            ? []
            : (experience.company || experience.position || experience.description)
              ? [{ ...experience }]
              : [],
          education: (education.institution || education.degree || education.field || education.description)
            ? [{ ...education }]
            : []
        }
      };

      await updateUser(payload);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setErrors([error.message || 'Failed to update profile']);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'company', label: 'Company Info', icon: '🏢' }
  ];

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your personal and professional information</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="profile-main">
            {errors.length > 0 && (
              <div className="error-messages">
                {errors.map((error, index) => (
                  <div key={index} className="error-message">
                    {error}
                  </div>
                ))}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
              {activeTab === 'personal' && (
                <div className="form-section">
                  <h3>Personal Information</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile.phone">Phone Number</label>
                      <input
                        type="tel"
                        id="profile.phone"
                        name="profile.phone"
                        value={formData.profile.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="profile.location">Location</label>
                      <input
                        type="text"
                        id="profile.location"
                        name="profile.location"
                        value={formData.profile.location}
                        onChange={handleChange}
                        placeholder="City, State"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="profile.bio">Bio</label>
                    <textarea
                      id="profile.bio"
                      name="profile.bio"
                      value={formData.profile.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="form-section">
                  <h3>Professional Information</h3>

                  <div className="form-group">
                    <label>Skills</label>
                    <div className="skill-input-container">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill"
                        disabled={loading}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button type="button" onClick={addSkill} disabled={loading}>
                        Add
                      </button>
                    </div>
                    <div className="skills-list">
                      {formData.profile.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            disabled={loading}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Experience</label>
                    <div className="form-subsection">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="checkbox-label">
                            <input type="checkbox" checked={noExperience} onChange={(e) => setNoExperience(e.target.checked)} disabled={loading} />
                            <span className="checkmark"></span>
                            I have no experience
                          </label>
                        </div>
                      </div>
                      {!noExperience && (
                        <>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Company</label>
                              <input type="text" value={experience.company} onChange={(e) => setExperience({ ...experience, company: e.target.value })} disabled={loading} />
                            </div>
                            <div className="form-group">
                              <label>Position</label>
                              <input type="text" value={experience.position} onChange={(e) => setExperience({ ...experience, position: e.target.value })} disabled={loading} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <textarea rows={3} value={experience.description} onChange={(e) => setExperience({ ...experience, description: e.target.value })} disabled={loading} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Education</label>
                    <div className="form-subsection">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Institution</label>
                          <input type="text" value={education.institution} onChange={(e) => setEducation({ ...education, institution: e.target.value })} disabled={loading} />
                        </div>
                        <div className="form-group">
                          <label>Degree</label>
                          <input type="text" value={education.degree} onChange={(e) => setEducation({ ...education, degree: e.target.value })} disabled={loading} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Field of Study</label>
                          <input type="text" value={education.field} onChange={(e) => setEducation({ ...education, field: e.target.value })} disabled={loading} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea rows={3} value={education.description} onChange={(e) => setEducation({ ...education, description: e.target.value })} disabled={loading} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && user?.role === 'employer' && (
                <div className="form-section">
                  <h3>Company Information</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company.name">Company Name *</label>
                      <input
                        type="text"
                        id="company.name"
                        name="company.name"
                        value={formData.company.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="company.website">Website</label>
                      <input
                        type="url"
                        id="company.website"
                        name="company.website"
                        value={formData.company.website}
                        onChange={handleChange}
                        placeholder="https://company.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company.industry">Industry</label>
                      <select
                        id="company.industry"
                        name="company.industry"
                        value={formData.company.industry}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select Industry</option>
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                        <option value="retail">Retail</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="consulting">Consulting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="company.size">Company Size</label>
                      <select
                        id="company.size"
                        name="company.size"
                        value={formData.company.size}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="company.location">Company Location</label>
                    <input
                      type="text"
                      id="company.location"
                      name="company.location"
                      value={formData.company.location}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="company.description">Company Description</label>
                    <textarea
                      id="company.description"
                      name="company.description"
                      value={formData.company.description}
                      onChange={handleChange}
                      placeholder="Tell us about your company..."
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'company' && user?.role !== 'employer' && (
                <div className="form-section">
                  <div className="company-info-placeholder">
                    <h3>Company Information</h3>
                    <p>Company information is only available for employers.</p>
                    <p>If you're an employer, please contact support to update your account type.</p>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
