import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) =>
    api.post('/auth/register', userData),
  
  login: (credentials) =>
    api.post('/auth/login', credentials),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (userData) =>
    api.put('/auth/profile', userData),
};

// Jobs API
export const jobsAPI = {
  getJobs: (filters) =>
    api.get('/jobs', { params: filters }),
  
  getJob: (id) =>
    api.get(`/jobs/${id}`),
  
  createJob: (jobData) =>
    api.post('/jobs', jobData),
  
  updateJob: (id, jobData) =>
    api.put(`/jobs/${id}`, jobData),
  
  deleteJob: (id) =>
    api.delete(`/jobs/${id}`),
  
  getCompanyJobs: (companyId) =>
    api.get(`/jobs/company/${companyId}`),
};

// Applications API
export const applicationsAPI = {
  applyForJob: (applicationData) =>
    api.post('/applications', applicationData),
  
  getApplications: (filters) =>
    api.get('/applications', { params: filters }),
  
  getApplication: (id) =>
    api.get(`/applications/${id}`),
  
  updateApplicationStatus: (id, statusData) =>
    api.put(`/applications/${id}/status`, statusData),
  
  getJobApplications: (jobId) =>
    api.get(`/applications/job/${jobId}`),
  
  withdrawApplication: (id) =>
    api.delete(`/applications/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (userData) =>
    api.put('/users/profile', userData),
  
  getDashboard: () =>
    api.get('/users/dashboard'),
  
  getUser: (id) =>
    api.get(`/users/${id}`),
  
  getUsers: (filters) =>
    api.get('/users', { params: filters }),
  
  updateUserStatus: (id, statusData) =>
    api.put(`/users/${id}/status`, statusData),
};

export default api;
