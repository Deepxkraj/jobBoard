import axios from 'axios';
import { AuthResponse, User, Job, Application, JobFilters, Pagination } from '../types';

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
  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', credentials),
  
  getProfile: () =>
    api.get<{ success: boolean; user: User }>('/auth/profile'),
  
  updateProfile: (userData: Partial<User>) =>
    api.put<{ success: boolean; user: User }>('/auth/profile', userData),
};

// Jobs API
export const jobsAPI = {
  getJobs: (filters?: JobFilters) =>
    api.get<{ success: boolean; jobs: Job[]; pagination: Pagination }>('/jobs', { params: filters }),
  
  getJob: (id: string) =>
    api.get<{ success: boolean; job: Job }>(`/jobs/${id}`),
  
  createJob: (jobData: Partial<Job>) =>
    api.post<{ success: boolean; job: Job }>('/jobs', jobData),
  
  updateJob: (id: string, jobData: Partial<Job>) =>
    api.put<{ success: boolean; job: Job }>(`/jobs/${id}`, jobData),
  
  deleteJob: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/jobs/${id}`),
  
  getCompanyJobs: (companyId: string) =>
    api.get<{ success: boolean; jobs: Job[] }>(`/jobs/company/${companyId}`),
};

// Applications API
export const applicationsAPI = {
  applyForJob: (applicationData: { jobId: string; coverLetter?: string; resume: string; additionalDocuments?: string[] }) =>
    api.post<{ success: boolean; application: Application }>('/applications', applicationData),
  
  getApplications: (filters?: { page?: number; limit?: number; status?: string }) =>
    api.get<{ success: boolean; applications: Application[]; pagination: Pagination }>('/applications', { params: filters }),
  
  getApplication: (id: string) =>
    api.get<{ success: boolean; application: Application }>(`/applications/${id}`),
  
  updateApplicationStatus: (id: string, statusData: { status: string; notes?: string }) =>
    api.put<{ success: boolean; application: Application }>(`/applications/${id}/status`, statusData),
  
  getJobApplications: (jobId: string) =>
    api.get<{ success: boolean; applications: Application[] }>(`/applications/job/${jobId}`),
  
  withdrawApplication: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/applications/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: () =>
    api.get<{ success: boolean; user: User }>('/users/profile'),
  
  updateProfile: (userData: Partial<User>) =>
    api.put<{ success: boolean; user: User }>('/users/profile', userData),
  
  getDashboard: () =>
    api.get<{ success: boolean; dashboard: any }>('/users/dashboard'),
  
  getUser: (id: string) =>
    api.get<{ success: boolean; user: User }>(`/users/${id}`),
  
  getUsers: (filters?: { page?: number; limit?: number }) =>
    api.get<{ success: boolean; users: User[]; pagination: Pagination }>('/users', { params: filters }),
  
  updateUserStatus: (id: string, statusData: { isActive: boolean }) =>
    api.put<{ success: boolean; user: User }>(`/users/${id}/status`, statusData),
};

export default api;
