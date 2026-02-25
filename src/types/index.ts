// Type definitions for CivicConnect

export type UserRole = 'citizen' | 'volunteer' | 'admin' | 'authority';

export type ComplaintStatus = 
  | 'submitted' 
  | 'verified' 
  | 'assigned' 
  | 'in-progress' 
  | 'resolved';

export type ComplaintCategory = 
  | 'garbage' 
  | 'water' 
  | 'roads' 
  | 'electricity' 
  | 'public-safety'
  | 'other';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  points: number;
  joinedDate: Date;
  avatar?: string;
}

export interface Location {
  lat: number;
  lng: number;
  area: string;
  address?: string;
}

export interface Update {
  updateId: string;
  message: string;
  image?: string;
  timestamp: Date;
  updatedBy: string;
}

export interface Complaint {
  complaintId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  imageURL?: string; // For backwards compatibility
  images?: string[]; // Support multiple images
  location: Location;
  status: ComplaintStatus;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  updates: Update[];
  upvotes: number;
  priority: 'low' | 'medium' | 'high';
}

export interface Volunteer {
  volunteerId: string;
  joinedIssues: string[];
  completedTasks: number;
  rating: number;
}

export interface Stats {
  totalIssues: number;
  resolvedIssues: number;
  activeVolunteers: number;
  avgResolutionTime: number;
}
