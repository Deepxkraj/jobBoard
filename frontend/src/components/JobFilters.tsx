import React, { useState } from 'react';
import { JobFilters } from '../types';
import './JobFilters.css';

interface JobFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: Partial<JobFilters>) => void;
  onClearFilters: () => void;
}

const JobFiltersComponent: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<JobFilters>>({
    search: filters.search || '',
    location: filters.location || '',
    type: filters.type || '',
    category: filters.category || '',
    experience: filters.experience || '',
    minSalary: filters.minSalary || undefined,
    maxSalary: filters.maxSalary || undefined,
  });

  const handleInputChange = (field: keyof JobFilters, value: string | number) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      location: '',
      type: '',
      category: '',
      experience: '',
      minSalary: undefined,
      maxSalary: undefined,
    });
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== undefined && value !== null
  );

  return (
    <div className="job-filters">
      <div className="filters-header">
        <h3>Filter Jobs</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="clear-filters-btn"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filters-content">
        <div className="filter-group">
          <label htmlFor="search">Search Keywords</label>
          <input
            type="text"
            id="search"
            placeholder="Job title, company, skills..."
            value={localFilters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="City, state, or remote"
            value={localFilters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="type">Job Type</label>
          <select
            id="type"
            value={localFilters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={localFilters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="technology">Technology</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="design">Design</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="engineering">Engineering</option>
            <option value="operations">Operations</option>
            <option value="human-resources">Human Resources</option>
            <option value="customer-service">Customer Service</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="experience">Experience Level</label>
          <select
            id="experience"
            value={localFilters.experience || ''}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="filter-select"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Salary Range</label>
          <div className="salary-inputs">
            <input
              type="number"
              placeholder="Min Salary"
              value={localFilters.minSalary || ''}
              onChange={(e) => handleInputChange('minSalary', e.target.value ? parseInt(e.target.value) : '')}
              className="filter-input salary-input"
            />
            <span className="salary-separator">to</span>
            <input
              type="number"
              placeholder="Max Salary"
              value={localFilters.maxSalary || ''}
              onChange={(e) => handleInputChange('maxSalary', e.target.value ? parseInt(e.target.value) : '')}
              className="filter-input salary-input"
            />
          </div>
        </div>

        <button
          onClick={handleApplyFilters}
          className="apply-filters-btn"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default JobFiltersComponent;
