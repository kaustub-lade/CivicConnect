# 🚀 CivicConnect Deployment Guide

Complete guide to deploy CivicConnect to production using Netlify (frontend) and Render (backend).

---

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ GitHub account
- ✅ Netlify account ([signup here](https://app.netlify.com/signup))
- ✅ Render account ([signup here](https://render.com/register))
- ✅ MongoDB Atlas account with a cluster set up
- ✅ (Optional) Cloudinary account for image uploads

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Production

1. **Verify your server code has the health check endpoint:**
   - File: `server/src/server.ts`
   - Endpoint: `GET /api/health`
   - ✅ Already configured!

2. **Ensure build script exists in package.json:**
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/server.js",
       "dev": "ts-node-dev --respawn src/server.ts"
     }
   }
   ```

### Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - CivicConnect production ready"

# Add remote (create a new repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/civicconnect.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy Backend on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the service:**
   - **Name:** `civicconnect-api`
   - **Region:** Oregon (US West) or closest to you
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/civicconnect?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-url.netlify.app
   ```
   
   **⚠️ Important:** You'll update `CLIENT_URL` after deploying frontend

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Test your backend:**
   - Your backend URL will be: `https://civicconnect-api.onrender.com`
   - Test health endpoint: `https://civicconnect-api.onrender.com/api/health`

---

## Part 2: Frontend Deployment on Netlify

### Step 1: Prepare Frontend for Production

1. **Create .env file in root directory:**
   ```bash
   # Copy from example
   cp .env.example .env
   ```

2. **Update .env with your backend URL:**
   ```
   VITE_API_URL=https://civicconnect-api.onrender.com/api
   ```

3. **Test build locally:**
   ```bash
   npm run build
   ```
   - Should create a `dist` folder with no errors

### Step 2: Deploy Frontend on Netlify

#### Option A: Deploy via Netlify UI (Easier)

1. **Go to [Netlify Dashboard](https://app.netlify.com/)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub** and select your repository

4. **Configure build settings:**
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

5. **Add Environment Variables:**
   - Click "Site settings" → "Environment variables"
   - Add: `VITE_API_URL` = `https://civicconnect-api.onrender.com/api`

6. **Click "Deploy site"**

7. **Your site will be live at:** `https://random-name-123.netlify.app`

#### Option B: Deploy via Netlify CLI (Advanced)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
netlify init

# Deploy
netlify deploy --prod
```

### Step 3: Custom Domain (Optional)

1. In Netlify, go to **Domain settings**
2. Click **Add custom domain**
3. Follow instructions to configure DNS

---

## Part 3: Update CORS Settings

### Update Backend Environment Variable on Render

1. Go to your Render service dashboard
2. Click "Environment" tab
3. Update `CLIENT_URL` to your Netlify URL:
   ```
   CLIENT_URL=https://your-site-name.netlify.app
   ```
4. Save and wait for automatic redeployment

---

## Part 4: MongoDB Atlas Configuration

### Whitelist Render's IP Addresses

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com/)**
2. Click **Network Access** in left sidebar
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ For production, you should whitelist specific IPs
5. Click **Confirm**

### Verify Connection String

Ensure your `MONGODB_URI` in Render includes:
- ✅ Correct username/password
- ✅ Database name: `civicconnect`
- ✅ `retryWrites=true&w=majority`

---

## Part 5: Post-Deployment Testing

### Test Checklist

1. **Backend Health Check:**
   ```bash
   curl https://civicconnect-api.onrender.com/api/health
   ```
   - Should return: `{"status":"ok",...}`

2. **Frontend Loads:**
   - Visit your Netlify URL
   - Homepage should load without errors

3. **Authentication Flow:**
   - ✅ Sign up with new account
   - ✅ Login with credentials
   - ✅ See user avatar in navbar
   - ✅ Access protected routes

4. **Report Issue:**
   - ✅ Fill form and submit
   - ✅ Image upload works (if Cloudinary configured)
   - ✅ Data saves to MongoDB

5. **Map Page:**
   - ✅ Leaflet map renders
   - ✅ Markers display
   - ✅ Popups work

6. **Responsive Design:**
   - ✅ Test on mobile device/responsive mode
   - ✅ All pages look good

---

## 🔧 Troubleshooting

### Issue: Backend won't start on Render

**Solution:**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check Render logs: Dashboard → Logs tab
- Ensure `npm run build` creates `dist` folder locally

### Issue: Frontend can't connect to backend

**Solution:**
- Verify `VITE_API_URL` is set in Netlify environment variables
- Check browser console for CORS errors
- Verify `CLIENT_URL` in backend matches Netlify URL
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: MongoDB connection fails

**Solution:**
- Whitelist 0.0.0.0/0 in MongoDB Network Access
- Verify connection string has correct credentials
- Test connection string locally first
- Check MongoDB Atlas cluster is active

### Issue: Images not loading

**Solution:**
- If using Cloudinary, verify API keys are set
- Check image URLs in browser network tab
- Verify CORS allows image domains

### Issue: 404 on page refresh

**Solution:**
- Netlify redirects should be configured in `netlify.toml`
- ✅ Already configured! (redirects `/*` to `/index.html`)

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
- Go to Render Dashboard → Your Service → Logs tab
- Real-time logs of your backend

### Frontend Logs (Netlify)
- Go to Netlify Dashboard → Your Site → Deploys → [specific deploy] → Deploy log
- Shows build process and errors

### MongoDB Logs (Atlas)
- MongoDB Atlas → Clusters → Metrics tab
- Monitor connections, operations, and performance

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Netlify and Render support automatic deployments:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Deployment:**
   - Render will automatically rebuild backend
   - Netlify will automatically rebuild frontend
   - Wait 5-10 minutes for both to complete

### Manual Deployment

**Render:**
- Dashboard → Your Service → Manual Deploy → "Deploy latest commit"

**Netlify:**
- Dashboard → Your Site → Deploys → "Trigger deploy"

---

## 🎯 Performance Optimization

### Frontend Optimizations

1. **Enable Caching:**
   - ✅ Already configured in `netlify.toml`
   - Assets cached for 1 year

2. **Compress Assets:**
   - Netlify automatically compresses (gzip/brotli)

3. **Split Bundles:**
   - Vite automatically code-splits

### Backend Optimizations

1. **Enable Compression:**
   - ✅ Already using `compression` middleware

2. **Add Redis Cache:** (Optional)
   - Use Render Redis addon for caching API responses

3. **Database Indexing:**
   - Add indexes to MongoDB collections
   ```javascript
   // In your models
   complaintSchema.index({ status: 1, category: 1 });
   userSchema.index({ email: 1 });
   ```

---

## 🔒 Security Checklist

- ✅ Environment variables not committed to git
- ✅ JWT secrets are strong (32+ characters)
- ✅ CORS configured with specific origins
- ✅ Helmet.js enabled for security headers
- ✅ Passwords hashed with bcrypt
- ✅ MongoDB Atlas network access restricted
- ✅ HTTPS enabled (automatic on Netlify/Render)

---

## 📱 Progressive Web App (Future Enhancement)

To make CivicConnect installable as a PWA:

1. Add `vite-plugin-pwa` to your project
2. Configure service worker
3. Add manifest.json
4. Test offline functionality

---

## 🎉 Success!

Your CivicConnect application is now live! 

- **Frontend:** https://your-site-name.netlify.app
- **Backend:** https://civicconnect-api.onrender.com
- **Database:** MongoDB Atlas

### Share Your Project

1. Add live URL to GitHub README
2. Update portfolio with project link
3. Share on LinkedIn/Twitter
4. Add to your resume

---

## 📞 Support

If you encounter issues:

1. Check Render/Netlify logs first
2. Review this guide's troubleshooting section
3. Check MongoDB Atlas cluster status
4. Verify all environment variables

---

**Last Updated:** February 25, 2026  
**Version:** 1.0.0  
**Deployed on:** Netlify (Frontend) + Render (Backend) + MongoDB Atlas (Database)

Happy Deploying! 🚀
