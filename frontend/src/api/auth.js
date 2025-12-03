import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const clearStoredSession = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const authAPI = {
  // Signup
  signup: async (email, password, fullName, confirmPassword = null) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
        fullName,
        ...(confirmPassword && { confirmPassword }),
      });

      // Store session token and user data
      if (data.session) {
        localStorage.setItem("access_token", data.session.access_token);
        localStorage.setItem("refresh_token", data.session.refresh_token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.message || "Signup failed",
      );
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      // Store session token and user data
      if (data.session) {
        localStorage.setItem("access_token", data.session.access_token);
        localStorage.setItem("refresh_token", data.session.refresh_token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.message || "Login failed",
      );
    }
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        await axios.post(`${API_BASE_URL}/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Ignore logout errors
      }
    }

    clearStoredSession();
    return { success: true };
  },

  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("No token found");
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update stored user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        clearStoredSession();
      }
      throw new Error(
        error.response?.data?.error || error.message || "Failed to get user",
      );
    }
  },

  // Get stored user from localStorage
  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },
};
