# JobConnect - Complete MERN Stack Job Board Application

## 🎯 Project Overview

JobConnect is a comprehensive job board platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform enables employers to post jobs and job seekers to browse, apply, and manage their applications.

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- **User Registration** with role selection (Job Seeker, Employer, Admin)
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** throughout the application
- **Protected Routes** for different user types
- **Session Management** with automatic token refresh

### 👤 User Management
- **Comprehensive Profile Management** with personal, professional, and company information
- **Skill Management** for job seekers
- **Company Information** for employers
- **Profile Picture** and document upload support
- **Experience and Education** tracking

### 💼 Job Management
- **Job Posting** with detailed forms and validation
- **Job Browsing** with advanced search and filtering
- **Job Categories** and types (Full-time, Part-time, Contract, Internship, Remote)
- **Salary Range** specification with currency support
- **Application Deadlines** and requirements
- **Job Status** management (Active/Inactive)

### 📋 Application System
- **Job Applications** with cover letter and resume upload
- **Application Tracking** for job seekers
- **Status Management** (Pending, Reviewed, Shortlisted, Rejected, Accepted)
- **Application Withdrawal** functionality
- **Employer Notes** and feedback system

### 🎛️ Admin Dashboard
- **User Management** for administrators
- **Job Oversight** and moderation
- **System Statistics** and analytics
- **User Role Management**

## 🛠️ Technical Stack

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern design patterns
- **Form Handling**: Controlled components with validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobBoard
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   **Backend (.env)**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobconnect
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   ```
   
   **Frontend (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # Start frontend server (in new terminal)
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📁 Project Structure

```
jobBoard/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Job.js           # Job schema
│   │   └── Application.js   # Application schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── jobs.js          # Job management routes
│   │   ├── applications.js  # Application routes
│   │   └── users.js         # User management routes
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main App component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filtering)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job (Employers only)
- `PUT /api/jobs/:id` - Update job (Job owner only)
- `DELETE /api/jobs/:id` - Delete job (Job owner only)

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

## 🎨 UI/UX Features

### Design System
- **Modern Gradient Design** with purple and blue color schemes
- **Responsive Layout** for mobile, tablet, and desktop
- **Consistent Typography** and spacing
- **Interactive Elements** with hover effects and animations
- **Loading States** and error handling
- **Form Validation** with user-friendly error messages

### User Experience
- **Intuitive Navigation** with role-based menus
- **Search and Filtering** capabilities
- **Pagination** for large datasets
- **Modal Dialogs** for complex interactions
- **Toast Notifications** for user feedback
- **Accessibility** considerations

## 🔒 Security Features

- **Password Hashing** with bcryptjs
- **JWT Token Authentication** with expiration
- **Input Validation** on both frontend and backend
- **SQL Injection Prevention** with Mongoose ODM
- **CORS Configuration** for cross-origin requests
- **Environment Variables** for sensitive data

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

The application includes:
- **Frontend Validation** for all forms
- **Backend Validation** with express-validator
- **Error Handling** throughout the application
- **TypeScript** for type safety
- **ESLint** for code quality

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3

## 📈 Future Enhancements

- **Email Notifications** for application status updates
- **File Upload** for resumes and documents
- **Advanced Search** with AI-powered matching
- **Real-time Chat** between employers and candidates
- **Analytics Dashboard** for job performance
- **Mobile App** development
- **Payment Integration** for premium features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed as a complete MERN stack application with modern web development practices and user-centered design.

---

**JobConnect** - Connecting talent with opportunity! 🎯

## 📚 Documentation

For detailed documentation, see [COMPLETE_PROJECT_DOCUMENTATION.md](./COMPLETE_PROJECT_DOCUMENTATION.md)