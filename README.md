# 🚀 Job & Internship Management Portal

### Completed this project

A full-stack web application for managing job and internship applications with role-based access control, built using the MERN stack.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Learning Outcomes](#-learning-outcomes)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT
- Role-based access control (Admin/User)
- Protected routes on both frontend and backend
- Persistent authentication state

### 👤 User Features
- Browse active job/internship listings
- Search and filter jobs by type, location
- Apply to jobs with resume link and cover note
- Track application status (Applied → Shortlisted → Selected → Rejected)
- View application history in personal dashboard
- Prevent duplicate applications

### 👨‍💼 Admin Features
- Create, update, and delete job listings
- Manage job status (Active/Closed)
- View all applications across all jobs
- Filter applications by job role and status
- Update application status via dropdown
- View detailed applicant information

### 🎨 UI/UX
- Clean, modern interface with Tailwind CSS
- Responsive design for all screen sizes
- Status badges with color coding
- Interactive dashboards
- Real-time data updates

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Job-Internship-Management-portal/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── JobListings.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   └── vite.config.js
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Jobs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/jobs` | Get all jobs (with filters) | Public |
| GET | `/api/jobs/:id` | Get single job | Public |
| POST | `/api/jobs` | Create new job | Admin |
| PUT | `/api/jobs/:id` | Update job | Admin |
| DELETE | `/api/jobs/:id` | Delete job | Admin |

**Query Parameters for GET /api/jobs:**
- `type` - Filter by job type (Job/Internship)
- `location` - Filter by location
- `search` - Search in title and description
- `isActive` - Filter by active status

### Applications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/applications` | Submit application | User |
| GET | `/api/applications/me` | Get user's applications | User |
| GET | `/api/applications` | Get all applications | Admin |
| GET | `/api/applications/:id` | Get single application | User/Admin |
| PUT | `/api/applications/:id/status` | Update application status | Admin |

**Query Parameters for GET /api/applications (Admin):**
- `jobId` - Filter by specific job
- `status` - Filter by application status
- `sortBy` - Sort applications (oldest/newest)

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

### Job Model
```javascript
{
  title: String (required),
  description: String (required),
  skills: [String],
  type: String (enum: ['Internship', 'Job'], required),
  location: String (required),
  stipend: String,
  duration: String,
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Application Model
```javascript
{
  userId: ObjectId (ref: User, required),
  jobId: ObjectId (ref: Job, required),
  resumeLink: String (required),
  coverNote: String,
  status: String (enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected']),
  appliedAt: Date
}
```

**Indexes:**
- User: `email` (unique)
- Application: Compound index on `userId` and `jobId` (unique) - prevents duplicate applications

## 📸 Screenshots

### Home Page
Landing page with hero section and feature highlights

### Job Listings
Browse and filter available jobs and internships

### User Dashboard
Track all your applications and their statuses

### Admin Dashboard
- **Applications Tab**: View and manage all applications
- **Jobs Tab**: Create, edit, and delete job postings

## 🌐 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory and deploy:
```bash
cd frontend
vercel
```

3. Set environment variable:
   - `VITE_API_URL` - Your Render backend URL

### MongoDB Atlas Setup

1. Create a cluster on MongoDB Atlas
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Replace `<password>` and `<dbname>` in connection string

## 📚 Learning Outcomes

This project demonstrates proficiency in:

### Backend Development
- RESTful API design and implementation
- JWT authentication and authorization
- Role-based access control (RBAC)
- MongoDB schema design with relationships
- Middleware implementation
- Error handling and validation
- Data filtering and querying

### Frontend Development
- React functional components and hooks
- Context API for state management
- Protected routes implementation
- Form handling and validation
- API integration with Axios
- Conditional rendering based on user roles
- Responsive design with Tailwind CSS

### Full-Stack Integration
- Client-server communication
- CORS configuration
- Environment variable management
- Authentication flow (login/signup/logout)
- Token-based session management
- Real-world application workflow

### Software Engineering Practices
- Project structure and organization
- Code modularity and reusability
- Version control with Git
- Environment-based configuration
- Documentation

## 🎯 Key Features Implemented

✅ JWT-based authentication  
✅ Role-based dashboards (Admin vs User)  
✅ CRUD operations for jobs  
✅ Application workflow with status transitions  
✅ Duplicate application prevention  
✅ Advanced filtering and search  
✅ Protected routes on frontend and backend  
✅ Responsive UI with Tailwind CSS  
✅ Form validation  
✅ Error handling  

## 🔮 Future Enhancements (Optional)

- Email notifications on status change
- File upload for resumes (Cloudinary integration)
- Pagination for large datasets
- Admin analytics dashboard
- Application status history log
- Export applications as CSV
- Advanced search with Elasticsearch
- Real-time notifications with Socket.io

## 👨‍💻 Author

**Riddhi**

## 📄 License

This project is open source and available under the MIT License.

---

**Note:** This is an intermediate-level full-stack project perfect for demonstrating skills to potential employers. It showcases real-world application development with proper authentication, authorization, and role-based workflows.
