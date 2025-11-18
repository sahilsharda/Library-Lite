const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.API_BASE_URL ||
  'http://localhost:3000/api';

const clearStoredSession = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

const handleJsonResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.meta = data;
    throw error;
  }
  return data;
};

// Auth API functions
export const authAPI = {
  // Signup
  signup: async (email, password, fullName, confirmPassword = null) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        fullName,
        ...(confirmPassword && { confirmPassword })
      }),
    });

    const data = await handleJsonResponse(response);

    // Store session token and user data
    if (data.session) {
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);
    }
    
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },    // Login
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await handleJsonResponse(response);

        // Store session token and user data
        if (data.session) {
            localStorage.setItem('access_token', data.session.access_token);
            localStorage.setItem('refresh_token', data.session.refresh_token);
        }
        
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

  // Logout
  logout: async () => {
    const token = localStorage.getItem('access_token');

    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => ({}));
    }

    clearStoredSession();
    return { success: true };
  },
  // Get current user
    getCurrentUser: async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        try {
          const data = await handleJsonResponse(response);

          // Update stored user data
          if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
          }

          return data;
        } catch (error) {
          if (error.status === 401) {
            clearStoredSession();
          }
          throw error;
        }
    },

    // Get stored user from localStorage
    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};
