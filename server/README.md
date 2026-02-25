# CivicConnect Server

Backend API for CivicConnect - A civic issue tracking and resolution platform.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Image Upload:** Cloudinary
- **Email:** Nodemailer

## Project Structure

```
server/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   └── complaint.controller.ts
│   ├── models/           # Database models
│   │   ├── User.model.ts
│   │   ├── Complaint.model.ts
│   │   ├── Comment.model.ts
│   │   └── VolunteerOpportunity.model.ts
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   ├── complaint.routes.ts
│   │   ├── user.routes.ts
│   │   └── volunteer.routes.ts
│   ├── middleware/       # Custom middleware
│   │   └── auth.middleware.ts
│   ├── utils/            # Utility functions
│   │   └── jwt.utils.ts
│   └── server.ts         # App entry point
├── .env.example          # Environment variables template
├── package.json
└── tsconfig.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get connection string
4. Add to `.env` file

### 3. Configure Environment Variables

```bash
# Copy example .env
cp .env.example .env

# Edit .env with your values
```

**Required Variables:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civicconnect
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (Protected)
POST   /api/auth/logout      - Logout user (Protected)
```

### Complaints
```
GET    /api/complaints              - Get all complaints (with filters)
GET    /api/complaints/:id          - Get single complaint
POST   /api/complaints              - Create complaint (Protected)
PUT    /api/complaints/:id          - Update complaint (Authority/Admin)
DELETE /api/complaints/:id          - Delete complaint (Protected)
POST   /api/complaints/:id/upvote   - Upvote complaint (Protected)
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
GET    /api/volunteers/opportunities        - Get opportunities
POST   /api/volunteers/opportunities        - Create opportunity (Protected)
POST   /api/volunteers/opportunities/:id/join - Join opportunity (Protected)
```

## Authentication

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **citizen** - Regular user, can report issues
- **volunteer** - Can join volunteer opportunities
- **authority** - Can update complaint status, add updates
- **admin** - Full access

## Database Models

### User
- name, email, password (hashed)
- role, avatar, phone, location
- points, badges, joinedDate

### Complaint
- title, description, category
- imageURL, location (lat/lng/area)
- status, priority, upvotes
- createdBy, assignedTo, updates[]

### Comment
- complaint (ref), user (ref)
- text, timestamps

### VolunteerOpportunity
- title, description, category
- location, date, duration
- participants[], organizer, status

## Next Steps (Optional Enhancements)

- [ ] Add Cloudinary integration for image uploads
- [ ] Implement email notifications
- [ ] Add Socket.io for real-time updates
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger)
- [ ] Write unit tests
- [ ] Add Redis for caching
- [ ] Implement file upload endpoint

## License

MIT
