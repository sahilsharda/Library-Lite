# Library Lite - Complete Startup Guide

## 🚀 Quick Start (2 Minutes)

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (optional - works with mock auth)

---

## 📋 Step-by-Step Setup

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd "Library Lite/backend"

# Install dependencies
npm install

# Start the backend server
npm run dev
```

**Expected Output:**

```
⚠️  Using MOCK Supabase Auth (Local Development Mode) ⚠️
Server is running on port 3000
```

✅ **Backend is now running on http://localhost:3000**

---

### 2️⃣ Frontend Setup

Open a **NEW terminal** and run:

```bash
# Navigate to frontend directory
cd "Library Lite/frontend"

# Install dependencies
npm install

# Start the frontend dev server
npm run dev
```

**Expected Output:**

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5174/
➜  Network: use --host to expose
```

✅ **Frontend is now running on http://localhost:5174**

---

## 🎯 Accessing the Application

### Public Pages (No Login Required)

1. **Landing Page**: http://localhost:5174/
2. **Shop**: http://localhost:5174/shop
3. **Cart**: http://localhost:5174/cart

### Authentication

- **Login/Signup**: http://localhost:5174/auth
- **Demo Mode**: http://localhost:5174/auth?mode=signup

### Protected Pages (Login Required)

- **Dashboard**: http://localhost:5174/dashboard
- **User Profile**: http://localhost:5174/userprofile

---

## 🧪 Testing the Application

### Test Authentication Flow

1. **Create Account**:
   - Go to http://localhost:5174/auth?mode=signup
   - Enter any email (e.g., test@example.com)
   - Enter password (min 6 characters)
   - Click "Create Account"

2. **Login**:
   - Go to http://localhost:5174/auth
   - Use credentials from signup
   - Click "Sign In"

3. **Access Dashboard**:
   - After login, you'll be redirected to Dashboard
   - Explore: Books, Orders, Payments, Profile tabs

### Test Shopping Flow

1. **Browse Books**:
   - Visit Landing Page: http://localhost:5174/
   - Or Shop Page: http://localhost:5174/shop

2. **Add to Cart**:
   - Click "ADD TO CART" on any book
   - Cart badge will update in header

3. **View Cart**:
   - Click cart icon in header
   - Or visit: http://localhost:5174/cart

---

## 🔧 Configuration

### Backend Configuration

**File**: `backend/.env`

```env
# Supabase (Optional - defaults to mock auth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Server
PORT=3000

# Database (If using real Supabase)
DATABASE_URL=your-postgres-connection-string
```

### Frontend Configuration

**File**: `frontend/.env`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Supabase (Optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🎨 Features Overview

### ✅ Implemented & Connected

#### Frontend Features

- [x] **Landing Page** - Hero section with features showcase
- [x] **Shop Page** - Browse books with categories and search
- [x] **Cart System** - Add/remove items, view cart
- [x] **Authentication** - Login, Signup with form validation
- [x] **Dashboard** - User dashboard with stats and navigation
- [x] **User Profile** - View/edit profile information
- [x] **Theme System** - Dark gradient theme throughout
- [x] **Responsive Design** - Mobile-friendly UI

#### Backend Features

- [x] **Auth API** - Login, Signup, Logout endpoints
- [x] **Books API** - CRUD operations for books
- [x] **Dashboard API** - User dashboard data
- [x] **Users API** - Profile management
- [x] **Mock Auth** - Works without Supabase setup
- [x] **Error Handling** - Comprehensive error responses
- [x] **CORS** - Configured for frontend access

#### State Management

- [x] **AuthContext** - User authentication state
- [x] **CartContext** - Shopping cart state
- [x] **ThemeContext** - Light/Dark theme switching

---

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (Librarian)
- `PUT /api/books/:id` - Update book (Librarian)
- `DELETE /api/books/:id` - Delete book (Admin)

### Dashboard

- `GET /api/dashboard/user/:userId` - Get user dashboard

### Users

- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile

---

## 🛠️ Troubleshooting

### Issue: Backend won't start

**Solution**: Check if port 3000 is already in use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or change port in backend/.env
PORT=3001
```

### Issue: Frontend can't connect to backend

**Solution**: Verify API_BASE_URL

1. Check `frontend/.env` has correct URL
2. Ensure backend is running on same port
3. Check browser console for CORS errors

### Issue: Login/Signup not working

**Solution**: Check backend logs

1. Ensure backend shows "Using MOCK Supabase Auth"
2. Check browser Network tab for API errors
3. Verify password is at least 6 characters

### Issue: Cart not updating

**Solution**: Check CartProvider

1. Verify CartProvider wraps App in main.jsx
2. Check browser console for errors
3. Clear localStorage and refresh

---

## 📱 Navigation Flow

```
Landing Page (/)
├── Shop (/shop)
│   └── Cart (/cart)
├── Auth (/auth)
│   ├── Login
│   └── Signup
└── Protected Routes (requires login)
    ├── Dashboard (/dashboard)
    │   ├── Dashboard Home
    │   ├── Books
    │   ├── Orders
    │   ├── Payments
    │   └── Profile
    └── User Profile (/userprofile)
```

---

## 🎯 Key Features Connected

### ✅ Authentication Flow

- Landing Page → Login/Signup → Dashboard
- Protected routes redirect to auth if not logged in
- Logout returns to landing page

### ✅ Shopping Flow

- Browse books on Landing/Shop pages
- Add to cart (tracked in CartContext)
- View cart with item management
- Cart persists across page navigation

### ✅ Dashboard Integration

- User-specific data from backend
- Demo mode for testing without login
- Profile editing with API updates
- Navigation between all sections

### ✅ Theme Consistency

- Dark gradient theme across all pages
- Glassmorphic UI components
- Purple/blue accent colors
- Smooth transitions and animations

---

## 🚦 Health Check

### Backend Health Check

```bash
curl http://localhost:3000/health
```

**Expected Response:**

```json
{ "status": "OK", "message": "Server is running" }
```

### Frontend Health Check

Open browser and check:

1. Landing page loads without errors
2. Can navigate to /shop
3. Can open /auth page
4. Console shows no critical errors

---

## 📊 Project Status

### ✅ Fully Functional

- User authentication
- Shopping cart
- Page navigation
- API integration
- State management
- Theme system

### 🔄 Ready for Enhancement

- Real Supabase integration
- Payment processing
- Book borrowing system
- Admin panel
- Email notifications

---

## 🎓 Demo Credentials

When using mock auth, any credentials work:

- **Email**: any-email@example.com
- **Password**: any-password (min 6 chars)

---

## 📞 Support

If you encounter issues:

1. Check both terminal windows for errors
2. Review browser console for frontend errors
3. Verify `.env` files are configured
4. Ensure both servers are running
5. Try clearing browser cache/localStorage

---

## 🎉 Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5174
- [ ] Landing page accessible
- [ ] Can navigate to shop
- [ ] Can add items to cart
- [ ] Can signup/login
- [ ] Can access dashboard after login
- [ ] All navigation working
- [ ] No console errors

**All checked? You're all set! 🚀**
