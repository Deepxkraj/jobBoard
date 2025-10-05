export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'admin';
  profile?: {
    avatar?: string;
    phone?: string;
    location?: string;
    dateOfBirth?: string;
    gender?: string;
    bio?: string;
    skills?: string[];
    experience?: Experience[];
    education?: Education[];
    resume?: string;
    portfolio?: string;
    professional?: {
      title?: string;
      experience?: string;
      skills?: string[];
      education?: string;
      bio?: string;
    };
    social?: {
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
  };
  company?: {
    name?: string;
    website?: string;
    description?: string;
    industry?: string;
    size?: string;
    location?: string;
    logo?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  companyName: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  category: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  requirements: {
    experience: 'entry' | 'mid' | 'senior' | 'executive';
    skills: string[];
    education?: string;
  };
  benefits: string[];
  applicationDeadline: string;
  isActive: boolean;
  isRemote: boolean;
  applicationCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  job: Job;
  applicant: User;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  coverLetter?: string;
  resume: string;
  additionalDocuments?: string[];
  notes?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  category?: string;
  experience?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
}
