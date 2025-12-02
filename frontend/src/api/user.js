import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.API_BASE_URL ||
  'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const userAPI = {
  // Get user's dashboard data
  getDashboard: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    try {
      const { data } = await axios.get(`${API_BASE_URL}/dashboard/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch dashboard');
    }
  },

  // Get user's borrowed books
  getMyBooks: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    try {
      const { data } = await axios.get(`${API_BASE_URL}/loans?userId=${userId}`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch books');
    }
  },

  // Get all available books (catalog)
  getBooks: async (search = '', page = 1) => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.append('search', search);

    try {
      const { data } = await axios.get(`${API_BASE_URL}/books?${params}`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch books');
    }
  },

  // Get user's orders (purchases)
  getMyOrders: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    try {
      const { data } = await axios.get(`${API_BASE_URL}/payments/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch orders');
    }
  },

  // Get user's payments
  getMyPayments: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    try {
      const { data } = await axios.get(`${API_BASE_URL}/payments/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch payments');
    }
  },

  // Borrow a book
  borrowBook: async (bookId, dueDate) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    try {
      const { data } = await axios.post(`${API_BASE_URL}/loans/borrow`, 
        { userId, bookId, dueDate },
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to borrow book');
    }
  },

  // Return a book
  returnBook: async (loanId) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/loans/return`,
        { loanId },
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to return book');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    try {
      const { data } = await axios.put(`${API_BASE_URL}/users/${userId}`,
        profileData,
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to update profile');
    }
  },
};

