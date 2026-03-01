// API Service for CivicConnect

// Production API URL - hardcoded to bypass environment variable issues
const API_URL = 'https://civicconnect-api.onrender.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Complaint API
export const complaintAPI = {
  // Get all complaints with optional filters
  getAll: async (filters?: { category?: string; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await fetch(`${API_URL}/complaints?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch complaints');
    return response.json();
  },

  // Get single complaint by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/complaints/${id}`);
    if (!response.ok) throw new Error('Failed to fetch complaint');
    return response.json();
  },

  // Create new complaint
  create: async (complaintData: any) => {
    const response = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(complaintData),
    });
    if (!response.ok) throw new Error('Failed to create complaint');
    return response.json();
  },

  // Update complaint (authorities only)
  update: async (id: string, updateData: any) => {
    const response = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update complaint');
    return response.json();
  },

  // Delete complaint
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete complaint');
    return response.json();
  },

  // Upvote complaint
  upvote: async (id: string) => {
    const response = await fetch(`${API_URL}/complaints/${id}/upvote`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to upvote complaint');
    return response.json();
  },

  // Add status update
  addUpdate: async (id: string, updateData: { text: string; images?: string[] }) => {
    const response = await fetch(`${API_URL}/complaints/${id}/updates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to add update');
    return response.json();
  },

  // Get statistics
  getStats: async () => {
    const response = await fetch(`${API_URL}/complaints/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  // Update profile
  updateProfile: async (updateData: any) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // Get leaderboard
  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/users/leaderboard`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
};

// Volunteer API
export const volunteerAPI = {
  // Get all opportunities
  getOpportunities: async () => {
    const response = await fetch(`${API_URL}/volunteers/opportunities`);
    if (!response.ok) throw new Error('Failed to fetch opportunities');
    return response.json();
  },

  // Create opportunity
  create: async (opportunityData: any) => {
    const response = await fetch(`${API_URL}/volunteers/opportunities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(opportunityData),
    });
    if (!response.ok) throw new Error('Failed to create opportunity');
    return response.json();
  },

  // Join opportunity
  join: async (id: string) => {
    const response = await fetch(`${API_URL}/volunteers/opportunities/${id}/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to join opportunity');
    return response.json();
  },
};

// Upload API
export const uploadAPI = {
  // Upload image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },
};

