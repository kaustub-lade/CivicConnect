# Fix: Netlify "Failed to Prepare Repo" Error

## Problem
Netlify can't fetch your GitHub repository during the prepare stage. This is a **Netlify-GitHub connection issue**, not your code.

## ✅ Quick Solution: Deploy via CLI (Fastest)

This bypasses the GitHub integration entirely:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build your project
npm run build

# Deploy to your existing site
netlify deploy --prod --dir=dist --site=shimmering-cranachan-df61bb
```

Then add environment variables in Netlify dashboard:
- `VITE_API_URL` = `https://civicconnect-api.onrender.com/api`
- `VITE_SOCKET_URL` = `https://civicconnect-api.onrender.com`

---

## Alternative Fixes (if you prefer GitHub integration)

### Fix #1: Clear Build Cache
1. Go to: https://app.netlify.com/sites/shimmering-cranachan-df61bb/deploys
2. Click "Deploys" → Options → "Clear cache and retry deploy"

### Fix #2: Reconnect Repository  
1. Go to: https://app.netlify.com/sites/shimmering-cranachan-df61bb/settings#general
2. Under "Build & deploy" → "Link to repository"
3. Click "Relink repository"
4. Select: `kaustub-lade/CivicConnect`

### Fix #3: Fresh Site Import
1. Go to: https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub → `kaustub-lade/CivicConnect`
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: leave blank
5. Add environment variables before deploying

---

## Why This Happens

Common causes:
- Netlify's GitHub app lost repository access
- Cached build state is corrupted
- Temporary Netlify infrastructure issue

## Verification

Your repository is healthy:
- ✅ No submodules
- ✅ No Git LFS files
- ✅ No large files
- ✅ Git integrity check passed
- ✅ No node_modules committed

The issue is purely on Netlify's side fetching from GitHub.
