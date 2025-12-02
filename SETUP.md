# Library Lite - Setup Guide

Complete guide to set up and run **Library Lite** on your local machine.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Run the Application](#4-run-the-application)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** database (or use Supabase for cloud database)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/AmanCrafts/Library-Lite.git
cd Library-Lite

# 2. Install all dependencies
npm run install:all

# 3. Set up environment variables (see detailed setup below)
# Create backend/.env file with your database credentials

# 4. Set up database
npm run db:setup

# 5. Run both backend and frontend
npm run dev
```

---

## Detailed Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AmanCrafts/Library-Lite.git
cd Library-Lite
```

### 2. Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Create environment file
Create a `.env` file in the `backend` directory:

```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/library_lite?schema=public"

# OR use Supabase (recommended for cloud database)
DATABASE_URL="your_supabase_connection_string"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

**How to get Supabase Database URL:**
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

#### Step 3: Install backend dependencies
```bash
npm install
```

#### Step 4: Set up database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init

# Seed the database with sample data (100 books)
node prisma/seed.js
```

#### Step 5: Verify database (optional)
```bash
# Open Prisma Studio to view your database
npx prisma studio
```

### 3. Frontend Setup

#### Step 1: Navigate to frontend directory
```bash
cd ../frontend
```

#### Step 2: Create environment file (optional)
Create a `.env` file in the `frontend` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# For production deployment (Render/Vercel)
# VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

> **Note:** If you don't create this file, it will default to `http://localhost:3000/api`

#### Step 3: Install frontend dependencies
```bash
npm install
```

### 4. Run the Application

#### Option 1: Run from root directory (recommended)
```bash
# Go back to root directory
cd ..

# Run both backend and frontend with colored output
npm run dev
```

#### Option 2: Run separately
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

#### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

---

## Available Scripts

Run these commands from the **root directory**:

### Installation
```bash
npm run install:all     # Install all dependencies (backend + frontend)
```

### Development
```bash
npm run dev             # Run both backend and frontend with colored output
npm run dev:backend     # Run only backend server
npm run dev:frontend    # Run only frontend server
```

### Database Management
```bash
npm run db:setup        # Run migrations and seed database
```

### Build
```bash
npm run build           # Build frontend for production
```

---

## Deployment

### Backend (Render.com)

1. Create a new Web Service on [Render](https://render.com/)
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
4. Add environment variables:
   ```
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. Deploy

### Frontend (Vercel)

1. Import your repository on [Vercel](https://vercel.com/)
2. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```
4. Deploy

---

## Troubleshooting

### Issue: "Member not found" error
**Solution:** The Member model is optional. This error is fixed in the latest version.

### Issue: CORS errors in production
**Solution:** Make sure `FRONTEND_URL` environment variable is set correctly in your backend deployment.

### Issue: Database connection failed
**Solution:** 
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL/Supabase is running
- Verify database credentials

### Issue: Frontend can't connect to backend
**Solution:**
- Check that backend is running on port 3000
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for actual error

### Issue: Prisma errors
**Solution:**
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # This will reset the database
node prisma/seed.js
```

### Issue: Port already in use
**Solution:**
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

---

## Default Credentials

After seeding the database, you can log in with:

**Admin User:**
- Email: `admin@library.com`
- Password: `admin123`

**Test User:**
- Email: `user@library.com`
- Password: `user123`

> **Note:** Change these credentials in production!

---

## Tech Stack

- **Frontend:** React 19, Vite, Axios, React Router
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT (JSON Web Tokens)

---

## Project Structure

```
Library-Lite/
├── backend/
│   ├── middleware/       # Authentication middleware
│   ├── prisma/          # Database schema and migrations
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── supabase/        # Supabase configuration
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── api/         # API client and services
│   │   ├── components/  # React components
│   │   ├── assets/      # Images, fonts, etc.
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── .env             # Environment variables
├── package.json         # Root package.json with scripts
├── README.md
└── SETUP.md            # This file
```

---

## Need Help?

- Check the [README.md](./README.md) for project overview
- Check the [UPDATE.md](./UPDATE.md) for recent changes
- Open an issue on [GitHub](https://github.com/AmanCrafts/Library-Lite/issues)

---

## License

ISC

---

**Happy Coding! 📚✨**
