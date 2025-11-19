import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import './Dashboard.css';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const roleOk = roleFilter === 'all' || u.role === roleFilter;
      const s = search.trim().toLowerCase();
      const searchOk = s === '' || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      return roleOk && searchOk;
    });
  }, [users, roleFilter, search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await usersAPI.getUsers({ page, limit });
        setUsers(resp.data.users);
        setPagination(resp.data.pagination);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, limit]);

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await usersAPI.updateUserStatus(userId, { isActive: !isActive });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: !isActive } : u)));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="container">
          <h1>Admin • Manage Users</h1>
          <p>View, filter, and manage all platform users.</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          <div className="section">
            <div className="section-header">
              <h2>Users</h2>
              <div className="section-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input"
                  style={{ minWidth: 240 }}
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All roles</option>
                  <option value="jobseeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                  className="form-select"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} / page</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : error ? (
              <div className="error-message"><p>{error}</p></div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="empty-state">
                            <p>No users found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                              <Link to={`/profile/${u._id}`} className="link-muted">View profile</Link>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                          <td>
                            <span className={`status-badge ${u.isActive ? 'status-active' : 'status-inactive'}`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-primary'}`}
                              onClick={() => toggleUserStatus(u._id, u.isActive)}
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <div className="pagination-info">
                <span>
                  Page {pagination?.currentPage || page}{pagination?.totalPages ? ` of ${pagination.totalPages}` : ''}
                </span>
              </div>
              <div className="pagination-controls" style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={!(pagination?.hasPrev ?? page > 1)}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={!(pagination?.hasNext ?? false)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

