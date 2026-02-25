import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      // Allow connection without token for public updates
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.data.user = decoded;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user-specific room if authenticated
    if (socket.data.user) {
      socket.join(`user:${socket.data.user.userId}`);
      console.log(`User ${socket.data.user.userId} joined their room`);
    }

    // Join all users to a broadcast room for public notifications
    socket.join('all-users');

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

// Helper functions to emit events from controllers
export function emitComplaintNew(io: SocketIOServer, complaint: any) {
  io.to('all-users').emit('complaint:new', {
    complaintId: complaint._id,
    title: complaint.title,
    category: complaint.category,
    location: complaint.location,
    status: complaint.status,
  });
}

export function emitComplaintUpdated(io: SocketIOServer, complaint: any) {
  io.to('all-users').emit('complaint:updated', {
    complaintId: complaint._id,
    title: complaint.title,
    status: complaint.status,
  });

  // Also notify the creator specifically
  if (complaint.createdBy) {
    io.to(`user:${complaint.createdBy}`).emit('complaint:updated', complaint);
  }
}

export function emitComplaintResolved(io: SocketIOServer, complaint: any) {
  io.to('all-users').emit('complaint:resolved', {
    complaintId: complaint._id,
    title: complaint.title,
    resolvedAt: new Date(),
  });

  // Notify the creator
  if (complaint.createdBy) {
    io.to(`user:${complaint.createdBy}`).emit('complaint:resolved', complaint);
  }
}

export function emitVolunteerNew(io: SocketIOServer, opportunity: any) {
  io.to('all-users').emit('volunteer:new', {
    opportunityId: opportunity._id,
    title: opportunity.title,
    points: opportunity.points,
    date: opportunity.date,
  });
}
