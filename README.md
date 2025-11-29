# AI-Powered Resume Analyzer

A full-stack AI-powered resume analysis platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring intelligent resume parsing, skill assessment, and role-based access control for job seekers, recruiters, and admins.

## 📋 Table of Contents
- [Team Members](#team-members)
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Development Tools](#development-tools)

## 👥 Team Members
- **Waasila Asif** - *wasif.bscs24seecs@seecs.edu.pk*
- **Fatima Sajjad** - *fsajjad.bscs24seecs@seecs.edu.pk*
- **Aman Ajmal** - *aajmal.bscs24seecs@seecs.edu.pk* (GitHub: PeaceTabahi)
- **Zainab Raza** - *zmalik.bsai24seecs@seecs.edu.pk*

## 📁 Project Structure

```
FAST/
├── backend/                    # Node.js/Express backend
│   ├── index.js               # Main server entry point
│   ├── package.json           # Backend dependencies
│   ├── config/
│   │   └── dbconfig.js        # MongoDB configuration
│   ├── controllers/
│   │   └── auth.controller.js # Authentication logic
│   ├── models/
│   │   └── User.js            # User model schema
│   ├── routes/
│   │   └── auth.route.js      # Authentication routes
│   ├── src/
│   │   ├── Middleware/        # Custom middleware
│   │   └── Models/            # Additional models
│   └── utils/
│       └── generateToken.js   # JWT token utilities
│
├── frontend/                   # React/Vite frontend
│   ├── index.html             # HTML entry point
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── eslint.config.js       # ESLint configuration
│   ├── public/                # Static assets
│   └── src/
│       ├── App.jsx            # Main App component
│       ├── App.css            # App styles
│       ├── main.jsx           # React entry point
│       ├── index.css          # Global styles
│       ├── assets/            # Images, fonts, etc.
│       └── Componenets/
│           ├── Auth/
│           │   ├── Login.jsx
│           │   └── styles/
│           ├── Homepage/
│           ├── Dashboard/
│           ├── ProductDetail/
│           ├── Search/
│           ├── Cart/
│           ├── Chat/
│           ├── Profile/
│           └── Admin/
│
├── Routes/                     # Additional routing config
├── package.json               # Root dependencies
└── README.md                  # Project documentation
```

## ✨ Features

### For Buyers
- Browse products with search functionality
- View detailed product information
- Shopping cart management
- Real-time chat with sellers
- User profile management
- Order tracking

### For Sellers
- Comprehensive seller dashboard
- Product management (Add, Update, Delete)
- Category management
- Sales analytics
- Real-time chat with buyers
- Profile management

### For Admins
- Admin dashboard for platform oversight
- User management
- Platform analytics

### General Features
- JWT-based authentication
- Role-based access control (Buyer, Seller, Admin)
- Real-time messaging with Socket.io
- Image upload with Cloudinary
- Secure password hashing with bcrypt
- Rate limiting for API protection
- Session management

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, Passport.js (Google OAuth 2.0)
- **Real-time:** Socket.io
- **File Upload:** Multer, Cloudinary
- **Security:** Helmet, bcryptjs, express-rate-limit
- **Email:** Nodemailer
- **GraphQL:** Apollo Server Express
- **Validation:** Express Validator

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router
- **Styling:** CSS
- **Linting:** ESLint

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with required variables (see Environment Variables section)

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Root Setup
```bash
# Install root dependencies
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://zainabraza1960_db_user:VB418BNTMigQ7Acu@cluster0.ilyvaa8.mongodb.net/?appName=Cluster0

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

## 🤖 Development Tools & LLMs Used

We leveraged various AI assistants and development tools throughout the development process:

- **ChatGPT** - Code generation and problem-solving
- **Cursor** - AI-powered code editor
- **Claude** - Architecture and documentation assistance
- **Deepseek** - Code analysis and optimization
- **Bolt** - Rapid prototyping
- **Base44** - Development assistance
- **Vercel v0** - UI component generation

## 📦 Available Scripts

### Backend
```bash
npm run dev    # Start development server with nodemon
npm test       # Run tests
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔒 Security Features
- Password hashing with bcryptjs
- JWT token-based authentication
- HTTP security headers with Helmet
- Rate limiting to prevent abuse
- CORS configuration
- Input validation with express-validator

## 📝 License
This project is part of an academic hackathon at FAST NUCES.

## 🤝 Contributing
This is a hackathon project by FAST NUCES students. For any queries, please contact the team members listed above.

---
**Repository:** WebDevHackathon  
**Owner:** WaasilaAsif  
**Branch:** waasila-branch
