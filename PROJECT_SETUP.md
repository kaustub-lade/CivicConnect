# CivicConnect - Complete Project Setup Guide

## 🎯 Project Overview

CivicConnect is a full-stack civic issue tracking platform with:
- **Frontend:** React + TypeScript + Chakra UI + Leaflet Maps
- **Backend:** Node.js + Express + MongoDB + JWT Auth
- **Features:** Issue reporting, GPS location, image upload, interactive maps, user authentication

---

## 📁 Project Structure

```
CivicConnect/
├── src/                          # Frontend React app
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Route pages
│   ├── services/                 # API service layer
│   ├── types/                    # TypeScript definitions
│   └── main.tsx                 # App entry point
├── server/                       # Backend API
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # Database schemas
│   │   ├── routes/              # API endpoints
│   │   ├── middleware/          # Auth & validation
│   │   ├── utils/               # Helper functions
│   │   └── server.ts            # Server entry point
│   ├── .env                     # Environment variables
│   └── package.json
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

---

## 🚀 Setup Instructions

### Step 1: Install MongoDB

**Option A: Local MongoDB**
```powershell
# Download from https://www.mongodb.com/try/download/community
# Install and start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud - FREE)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Get connection string
5. Whitelist your IP address
6. Create database user

### Step 2: Backend Setup

```powershell
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civicconnect
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/civicconnect

JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Cloudinary (optional for now, get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

**Start backend server:**
```powershell
npm run dev
```
Server runs at `http://localhost:5000`

### Step 3: Frontend Setup

```powershell
# In root directory
npm install --legacy-peer-deps

# Start frontend
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## ✅ Completed Features

### Backend (100% Complete)
- ✅ Express server with TypeScript
- ✅ MongoDB database connection
- ✅ User authentication (register, login, JWT)
- ✅ Password hashing with bcrypt
- ✅ Protected routes & role-based access
- ✅ Complaint CRUD operations
- ✅ Upvote system
- ✅ Comment system
- ✅ Volunteer opportunities
- ✅ User profiles & leaderboard
- ✅ Image upload with Cloudinary
- ✅ Stats & analytics endpoints
- ✅ Error handling & validation

### Frontend (95% Complete)
- ✅ React + TypeScript + Vite
- ✅ Chakra UI component library
- ✅ 6 pages: Home, Report, Dashboard, Map, Volunteer, Profile
- ✅ Responsive navigation with mobile menu
- ✅ GPS location detection
- ✅ Interactive map with Leaflet (markers, popups, filters)
- ✅ Image upload preview
- ✅ Search & filter functionality
- ✅ Status timeline component
- ✅ Mock data for demonstration
- ⚠️ API integration (needs connection to backend)

---

## 🔌 Next Steps: Connect Frontend to Backend

### Update API Service

Edit `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

export const auth = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },
  // ... same for register, logout
};

export const complaints = {
  getAll: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/complaints?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },
  // ... similar pattern for other methods
};
```

### Create Auth Context

Create `src/context/AuthContext.tsx` for global auth state.

---

## 🎨 Additional Enhancements (Optional)

### 1. Charts & Analytics
```powershell
npm install recharts --legacy-peer-deps
```

### 2. Email Notifications

In `server/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # Get from Gmail settings
```

Create `server/src/utils/email.utils.ts` for Nodemailer setup.

### 3. Real-time Updates
```powershell
cd server
npm install socket.io
cd ..
npm install socket.io-client --legacy-peer-deps
```

### 4. Advanced Features
- PWA for offline support
- Push notifications
- Image compression before upload
- Dark mode toggle
- Multi-language support
- Export reports as PDF
- SMS alerts via Twilio

---

## 📝 API Endpoints Reference

### Authentication
```
POST   /api/auth/register - Register new user
POST   /api/auth/login    - Login user
GET    /api/auth/me       - Get current user (Protected)
POST   /api/auth/logout   - Logout
```

### Complaints
```
GET    /api/complaints              - Get all (filter: ?category=water&status=verified)
GET    /api/complaints/:id          - Get single complaint
POST   /api/complaints              - Create (Protected)
PUT    /api/complaints/:id          - Update (Authority/Admin)
DELETE /api/complaints/:id          - Delete (Protected)
POST   /api/complaints/:id/upvote   - Toggle upvote (Protected)
POST   /api/complaints/:id/updates  - Add update (Authority/Admin)
GET    /api/complaints/stats        - Get statistics
```

### Users
```
GET    /api/users/:id          - Get user profile
PUT    /api/users/profile      - Update profile (Protected)
GET    /api/users/leaderboard  - Get top users by points
```

### Volunteers
```
GET    /api/volunteers/opportunities        - Get all opportunities
POST   /api/volunteers/opportunities        - Create (Protected)
POST   /api/volunteers/opportunities/:id/join - Join (Protected)
```

### Upload
```
POST   /api/upload  - Upload image to Cloudinary (Protected)
```

---

## 🧪 Testing the Application

### Test Backend API

```powershell
# Test health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Test Frontend

1. Open `http://localhost:5173`
2. Navigate through all pages
3. Test GPS location button
4. Test image upload preview
5. Test map filtering
6. Test search functionality

---

## 📦 Deployment (Future)

### Frontend (Vercel/Netlify)
```powershell
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway/Heroku)
```powershell
cd server
npm run build
# Deploy with start script: node dist/server.js
```

### Database
- MongoDB Atlas (already cloud-based)
- Set production environment variables

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED
Solution: Ensure MongoDB is running (mongod command or service)
```

### Leaflet Map Not Showing
```
Issue: White box instead of map
Solution: Ensure Leaflet CSS is imported in CommunityMap.tsx
```

### Peer Dependency Warnings
```
Solution: Use --legacy-peer-deps flag for npm install
```

### CORS Errors
```
Issue: Frontend can't reach backend
Solution: Ensure CLIENT_URL in backend .env matches frontend URL
```

---

## 📚 Learning Resources

- **MongoDB:** [docs.mongodb.com](https://docs.mongodb.com)
- **Express:** [expressjs.com](https://expressjs.com)
- **React:** [react.dev](https://react.dev)
- **Chakra UI:** [chakra-ui.com](https://chakra-ui.com)
- **Leaflet:** [leafletjs.com](https://leafletjs.com)
- **JWT:** [jwt.io](https://jwt.io)

---

## 🎯 Resume/Portfolio Highlights

**Technical Skills Demonstrated:**
- Full-stack TypeScript development
- RESTful API design
- MongoDB database modeling
- JWT authentication & authorization
- Geospatial data handling
- Cloud storage integration
- State management with React Hooks
- Responsive UI design
- Map visualization

**Best Practices:**
- Clean code architecture (MVC pattern)
- Type safety with TypeScript
- Input validation & error handling
- Secure password handling
- Environment-based configuration
- Modular component structure

---

## 📞 Support

Issues? Check:
1. Both servers running (backend:5000, frontend:5173)
2. MongoDB connected
3. .env file configured
4. Node modules installed
5. Browser console for errors

---

## 🚀 You're All Set!

Your CivicConnect platform is ready for:
- ✅ GitHub repository showcase
- ✅ Resume project listing
- ✅ Portfolio demonstration
- ✅ Further feature development

**GitHub README.md Tips:**
- Add screenshots of each page
- Include architecture diagram
- List all technologies used
- Add "Getting Started" section
- Include API documentation
- Add demo video/GIF

Good luck with your project! 🎉
