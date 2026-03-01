# 🚀 CivicConnect Deployment Configuration

## Your Deployed Applications

### Frontend (Netlify)
**URL:** https://shimmering-cranachan-df61bb.netlify.app/

### Backend (Render)
**URL:** https://civicconnect-api.onrender.com

---

## ✅ Quick Setup Checklist

### 1️⃣ Netlify Environment Variables
Go to: https://app.netlify.com/ → Your Site → Site configuration → Environment variables

**Add these variables:**
```
VITE_API_URL=https://civicconnect-api.onrender.com/api
VITE_SOCKET_URL=https://civicconnect-api.onrender.com
```

**Then:**
1. Click "Save"
2. Go to "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"
4. Wait ~2 minutes for build

---

### 2️⃣ Render Environment Variables
Go to: https://dashboard.render.com/ → civicconnect-api → Environment

**Add/Update this variable:**
```
CLIENT_URL=https://shimmering-cranachan-df61bb.netlify.app
```

**Existing Required Variables (should already be set):**
```
MONGODB_URI=mongodb+srv://kaustublade1008_db_user:cYgvqFMlu9vk5CR1@cluster0.ghr60so.mongodb.net/civicconnect?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=civicconnect_secret_key_2026_kaustub_lade_portfolio_project
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
```

**Then:**
1. Click "Save Changes"
2. Render will auto-redeploy (5-10 minutes)

---

## 🧪 Test Your Deployment

### Backend Health Check
```bash
curl https://civicconnect-api.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "CivicConnect API is running"
}
```

### Frontend Test
1. Go to: https://shimmering-cranachan-df61bb.netlify.app/
2. Click "Login"
3. Use credentials:
   ```
   Email: citizen@test.com
   Password: Pass123!
   ```
4. Should successfully log in ✅

---

## 🔐 Test User Accounts

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@test.com | Pass123! |
| Authority | authority@test.com | Pass123! |
| Admin | admin@test.com | Pass123! |
| Volunteer | volunteer@test.com | Pass123! |

---

## 🐛 Troubleshooting

### "Failed to fetch" Error
**Cause:** Frontend can't reach backend
**Fix:**
1. Verify Netlify env vars are set correctly
2. Check Render backend is "Live" (green status)
3. Test backend health endpoint directly
4. Redeploy Netlify after setting env vars

### "CORS Error"
**Cause:** Backend not allowing frontend origin
**Fix:**
1. Verify CLIENT_URL is set in Render
2. Should be: `https://shimmering-cranachan-df61bb.netlify.app`
3. No trailing slash!
4. Redeploy Render after updating

### "Login failed"
**Cause:** Backend can't reach MongoDB
**Fix:**
1. Check MongoDB Atlas IP whitelist (0.0.0.0/0 for allow all)
2. Verify MONGODB_URI in Render env vars
3. Check Render logs for connection errors

### Socket.io Not Connecting
**Cause:** Wrong SOCKET_URL or CORS issue
**Fix:**
1. Verify VITE_SOCKET_URL in Netlify env vars
2. Check CLIENT_URL in Render env vars
3. Both services must be deployed for real-time to work

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  User Browser                                           │
│                                                         │
│  https://shimmering-cranachan-df61bb.netlify.app/     │
└────────────┬────────────────────────────────────────────┘
             │
             │ HTTP/WebSocket
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│  Render Backend API                                     │
│                                                         │
│  https://civicconnect-api.onrender.com                 │
└────────────┬────────────────────────────────────────────┘
             │
             │ MongoDB Connection
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│  MongoDB Atlas                                          │
│                                                         │
│  cluster0.ghr60so.mongodb.net                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Next Steps After Configuration

1. ✅ Set environment variables in both Netlify and Render
2. ✅ Redeploy both services
3. ✅ Test login with test accounts
4. ✅ Report a test issue as citizen
5. ✅ Update issue as authority
6. ✅ View analytics as admin
7. ✅ Test real-time notifications (open 2 browser windows)
8. ✅ Test PWA install on mobile

---

## 🔒 Security Notes

- MongoDB credentials are in environment variables ✅
- JWT secret is secure random string ✅
- CORS is configured for your frontend domain ✅
- Passwords are hashed with bcrypt ✅
- Test accounts use simple passwords (change for real production!)

---

## 📞 Support Links

- **Frontend Deploy:** https://app.netlify.com/
- **Backend Deploy:** https://dashboard.render.com/
- **Database:** https://cloud.mongodb.com/
- **GitHub Repo:** https://github.com/kaustub-lade/CivicConnect

---

**Your CivicConnect is ready for demo! 🎉**
