import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JobSeekerLogin from './pages/JobSeekerLogin';
import EmployerLogin from './pages/EmployerLogin';
import AdminLogin from './pages/AdminLogin';
import JobSeekerRegister from './pages/JobSeekerRegister';
import EmployerRegister from './pages/EmployerRegister';
import RoleSelection from './pages/RoleSelection';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import EmployerApplications from './pages/EmployerApplications';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import './App.css';
import AdminUsers from './pages/AdminUsers';
import ProfileReadOnly from './pages/ProfileReadOnly';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            {/* Role Selection */}
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <RoleSelection />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/login" 
              element={<Navigate to="/auth" replace />} 
            />
            <Route 
              path="/register" 
              element={<Navigate to="/auth" replace />} 
            />
            
            <Route 
              path="/login/jobseeker" 
              element={
                <PublicRoute>
                  <JobSeekerLogin role="jobseeker" />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login/employer" 
              element={
                <PublicRoute>
                  <EmployerLogin role="employer" />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login/admin" 
              element={
                <PublicRoute>
                  <AdminLogin role="admin" />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/register/jobseeker" 
              element={
                <PublicRoute>
                  <JobSeekerRegister role="jobseeker" />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register/employer" 
              element={
                <PublicRoute>
                  <EmployerRegister role="employer" />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/profile/:id"
                  element={
                    <ProtectedRoute>
                      <ProfileReadOnly />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <Applications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-applications"
                  element={
                    <ProtectedRoute allowedRoles={['employer', 'admin']}>
                      <EmployerApplications />
                    </ProtectedRoute>
                  }
                />
            <Route 
              path="/create-job" 
              element={
                <ProtectedRoute allowedRoles={['employer', 'admin']}>
                  <CreateJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-job/:id" 
              element={
                <ProtectedRoute allowedRoles={['employer', 'admin']}>
                  <EditJob />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
