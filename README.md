# CivicConnect

A youth-led civic issue tracking platform that allows citizens to report problems, track progress transparently, coordinate volunteers, and ensure accountability through public dashboards.

## 🌐 Live Demo

- **Frontend:** [Coming Soon - Deploy to Netlify]
- **Backend API:** [Coming Soon - Deploy to Render]
- **Documentation:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Production Ready](PRODUCTION_READY.md)** - Summary of production changes
- **[Test Report](TEST_REPORT.md)** - Comprehensive testing results
- **[Quick Test Summary](QUICK_TEST_SUMMARY.md)** - Quick reference guide

## 🚀 Features

### Core Features
- **Issue Reporting**: Citizens can easily report civic problems with photos, location, and descriptions
- **Real-time Tracking**: Monitor the status of complaints with complete transparency
- **Community Dashboard**: Public view of all issues with filters and statistics
- **Volunteer Hub**: Youth engagement through community initiatives and events
- **Gamification**: Points system, badges, and leaderboards to drive participation
- **Status Timeline**: Visual progress tracking from submission to resolution

### Issue Categories
- 🗑️ Garbage Management
- 💧 Water Supply
- 🛣️ Roads & Infrastructure
- ⚡ Electricity
- 🚨 Public Safety
- 📋 Other

### User Roles
- **Citizen**: Report issues, track complaints, participate as volunteer
- **Volunteer**: Join community initiatives, earn points and badges
- **Admin**: Manage complaints, assign authorities, moderate reports
- **Authority**: Update issue status, coordinate with teams

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Chakra UI** - Component library
- **React Router** - Navigation
- **React Icons** - Icon library
- **React Leaflet** - Map integration (planned)

### Backend
- **Node.js + Express** - RESTful API
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image uploads
- **Socket.io** - Real-time updates (planned)
- **TypeScript** - Type safety

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

**For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

#### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/civicconnect.git
cd CivicConnect
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your backend URL
VITE_API_URL=http://localhost:5000/api
```

4. **Install backend dependencies:**
```bash
cd server
npm install
```

5. **Set up backend environment:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your MongoDB URI, JWT secret, etc.
```

6. **Start backend server:**
```bash
npm run dev
# Backend runs on http://localhost:5000
```

7. **Start frontend (in another terminal):**
```bash
cd ..
npm run dev
# Frontend runs on http://localhost:5173
```

8. **Open browser at `http://localhost:5173`**

## 🚢 Deployment

### Quick Deploy

**Frontend (Netlify):**
1. Push to GitHub
2. Connect repository on Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL`

**Backend (Render):**
1. Create Web Service on Render
2. Connect GitHub repository
3. Set root directory: `server`
4. Add environment variables
5. Deploy!

**Full Instructions:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📁 Project Structure

```
CivicConnect/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── ComplaintCard.tsx
│   │   ├── StatusTimeline.tsx
│   │   └── StatsCard.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── ReportIssue.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CommunityMap.tsx
│   │   ├── VolunteerHub.tsx
│   │   └── Profile.tsx
│   ├── services/       # API service layer
│   │   └── api.ts
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── package.json
```

## 🎯 Key Components

### ComplaintCard
Displays individual civic issues with:
- Status badges
- Category icons
- Location information
- Upvote functionality
- Image preview

### StatusTimeline
Visual stepper showing issue progression:
1. Submitted
2. Verified
3. Assigned
4. In Progress
5. Resolved

### Dashboard
Central hub for tracking all issues with:
- Real-time statistics
- Search and filters
- Tabbed views (All, My Reports, Resolved)
- Category and status filters

## 🌟 Unique Features

### For Ideathon/Competition
- **Youth-Driven**: Specifically designed for youth engagement
- **Transparency First**: Public dashboards for accountability
- **Gamification**: Points, badges, and leaderboards
- **Offline Support** (Planned): Works in low connectivity areas
- **Community Collaboration**: Volunteers can coordinate efforts
- **AI Categorization** (Planned): Auto-categorize issues from images

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (#2196f3) - Trust and reliability
- **Secondary**: Green (#4caf50) - Growth and progress
- **Accent**: Purple (#764ba2) - Innovation and youth
- **Alert**: Orange/Red - Urgency

### Typography
- Font: Inter (Modern, readable, professional)

## 📊 Mock Data

Currently using mock data for demonstration. Replace with actual API calls in `src/services/api.ts`

## 🔜 Roadmap

### Phase 1 ✅ (Complete)
- ✅ Project setup
- ✅ Core UI components
- ✅ Page layouts
- ✅ Backend API with MongoDB
- ✅ User authentication (JWT)
- ✅ Image upload functionality
- ✅ Real-time GPS location
- ✅ Responsive design
- ✅ Production deployment configs

### Phase 2 🚧 (Current)
- ✅ AuthContext and login/signup
- ✅ API service layer
- ⬜ Integrate remaining pages with API
- ⬜ Deploy to production
- ⬜ Protected routes
- ⬜ Real-time notifications (Socket.io)

### Phase 3 (Future)
- [ ] Map integration with Leaflet
- [ ] Mobile app (React Native)
- [ ] AI-powered issue categorization
- [ ] SMS-based reporting
- [ ] Admin panel
- [ ] Analytics dashboard

## 🤝 Contributing

This project is built for the Samadhan 2026 ideathon. Contributions welcome!

## 📄 License

MIT License

## 👥 Team

Built by Kaustub Lade

## 🏆 Ideathon Points

### Problem-Solution Mapping
- **Lack of transparency** → Public dashboard and status tracking
- **No accountability** → Escalation system and public visibility
- **Youth disengagement** → Volunteer hub with gamification
- **Fragmented efforts** → Centralized platform for collaboration
- **Digital divide** → Offline mode (planned)

### Innovation Highlights
1. Youth-centric design with gamification
2. Transparent progress tracking
3. Community collaboration features
4. Civic score for localities
5. Duplicate detection system

---

**Made with ❤️ for better communities**
