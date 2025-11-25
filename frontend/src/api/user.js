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

const handleJsonResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return data;
};

export const userAPI = {
  // Get user's dashboard data
  getDashboard: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    const response = await fetch(`${API_BASE_URL}/dashboard/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleJsonResponse(response);
  },

  // Get user's borrowed books
  getMyBooks: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    const response = await fetch(`${API_BASE_URL}/loans?userId=${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleJsonResponse(response);
  },

  // Get all available books (catalog)
  getBooks: async (search = '', page = 1) => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/books?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleJsonResponse(response);
  },

  // Get user's orders (purchases)
  getMyOrders: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    // Get payments as orders
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleJsonResponse(response);
  },

  // Get user's payments
  getMyPayments: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleJsonResponse(response);
  },

  // Borrow a book
  borrowBook: async (bookId, dueDate) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    const response = await fetch(`${API_BASE_URL}/loans/borrow`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, bookId, dueDate }),
    });
    return handleJsonResponse(response);
  },

  // Return a book
  returnBook: async (loanId) => {
    const response = await fetch(`${API_BASE_URL}/loans/return`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ loanId }),
    });
    return handleJsonResponse(response);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.dbUser?.id;
    if (!userId) throw new Error('User not found');

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleJsonResponse(response);
  },
};

