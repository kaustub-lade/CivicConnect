# Backend Integration Guide

This guide explains how to integrate the new real-time and email features into your Express backend.

## 1. Socket.io Server Setup

### Step 1: Initialize Socket.io in your main server file

In `server/src/index.ts` or `server/src/server.ts`:

```typescript
import express from 'express';
import http from 'http';
import { initializeSocket } from './socket';

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Make io available in routes
app.set('io', io);

// ... rest of your Express setup

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2: Use socket events in your complaint controllers

Example: `server/src/controllers/complaintController.ts`

```typescript
import { emitComplaintNew, emitComplaintUpdated, emitComplaintResolved } from '../socket';

export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    
    // Emit real-time notification
    const io = req.app.get('io');
    emitComplaintNew(io, complaint);
    
    // Send email notification
    await sendEmail('complaintCreated', {
      to: req.user.email,
      complaint: complaint,
    });
    
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    // Emit update notification
    const io = req.app.get('io');
    emitComplaintUpdated(io, complaint);
    
    // Send email if status changed
    if (req.body.status) {
      await sendEmail('complaintUpdated', {
        to: complaint.userId.email,
        complaint: complaint,
        message: req.body.updateMessage || 'Your complaint has been updated',
      });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolvedAt: new Date() },
      { new: true }
    );
    
    // Emit resolution notification
    const io = req.app.get('io');
    emitComplaintResolved(io, complaint);
    
    // Send celebration email
    await sendEmail('complaintResolved', {
      to: complaint.userId.email,
      complaint: complaint,
    });
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 2. Email Service Setup

### Step 1: Configure environment variables

Add to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Frontend URL for email links
CLIENT_URL=http://localhost:5173
```

**Note:** For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use that app password in EMAIL_PASS

### Step 2: Import and use email service

```typescript
import { sendEmail } from './emails/emailService';

// In your controller
await sendEmail('complaintCreated', {
  to: user.email,
  complaint: complaintData,
});
```

## 3. Available Email Templates

### `complaintCreated`
Sends when a new complaint is submitted.
```typescript
await sendEmail('complaintCreated', {
  to: 'user@example.com',
  complaint: {
    complaintId: 'CMP001',
    title: 'Pothole on Main Street',
    category: 'Infrastructure',
    location: 'Main Street, Downtown',
  }
});
```

### `complaintUpdated`
Sends when a complaint status is updated.
```typescript
await sendEmail('complaintUpdated', {
  to: 'user@example.com',
  complaint: {
    complaintId: 'CMP001',
    title: 'Pothole on Main Street',
    status: 'in-progress',
  },
  message: 'Our team is working on your issue'
});
```

### `complaintResolved`
Sends when a complaint is marked as resolved.
```typescript
await sendEmail('complaintResolved', {
  to: 'user@example.com',
  complaint: {
    complaintId: 'CMP001',
    title: 'Pothole on Main Street',
    category: 'Infrastructure',
  }
});
```

## 4. Socket.io Events

### Available emit functions:

- `emitComplaintNew(io, complaint)` - Broadcast new complaint to all users
- `emitComplaintUpdated(io, complaint)` - Broadcast complaint update to all users
- `emitComplaintResolved(io, complaint)` - Broadcast resolution to all users
- `emitVolunteerNew(io, volunteer)` - Broadcast new volunteer signup

### Example usage:

```typescript
import { initializeSocket, emitComplaintNew } from './socket';

// In your route handler
const io = req.app.get('io');
emitComplaintNew(io, newComplaint);
```

## 5. Testing

### Test Socket.io:
1. Start your backend server
2. Open your React app in two browser windows
3. Create a complaint in one window
4. You should see a toast notification in the other window

### Test Email:
1. Configure your `.env` with valid SMTP credentials
2. Create/update a complaint
3. Check your email inbox
4. Verify the email has proper formatting and links

## 6. Production Deployment

### Environment Variables:
Make sure to set these in your production environment (Render, Heroku, etc.):
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `CLIENT_URL` (your production frontend URL)

### CORS Configuration:
Update your CORS settings to allow Socket.io:

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

### Socket.io CORS:
The socket.ts file already includes CORS configuration, but verify your CLIENT_URL is set correctly.

## 7. Troubleshooting

### Socket.io not connecting:
- Check that httpServer.listen() is used instead of app.listen()
- Verify SOCKET_URL in frontend .env matches your backend URL
- Check browser console for connection errors

### Emails not sending:
- Verify EMAIL_USER and EMAIL_PASS are correct
- For Gmail, ensure "App Password" is used (not regular password)
- Check firewall/network allows SMTP port 587
- Look at backend console for nodemailer errors

### Real-time notifications not showing:
- Ensure user is logged in (JWT token required)
- Check Socket.io connection status in browser DevTools
- Verify socket events are being emitted from backend

## 8. Next Steps

1. Create placeholder icons (192x192 and 512x512) for PWA in `/public` folder
2. Test PWA install on mobile Chrome
3. Monitor bundle sizes after build: `npm run build`
4. Set up email templates with your branding colors
5. Configure production SMTP service (SendGrid, AWS SES, etc.)
