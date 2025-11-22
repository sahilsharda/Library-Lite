import { apiClient } from './client';

export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: () => {
    return apiClient.get('/api/admin/reports');
  },

  // Get all users
  getAllUsers: () => {
    return apiClient.get('/api/admin/users');
  },

  // Update user role
  updateUserRole: (userId, role) => {
    return apiClient.put(`/api/admin/users/${userId}/role`, { role });
  },

  // Get activity logs
  getActivityLogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/admin/logs${queryString ? `?${queryString}` : ''}`);
  },

  // Generate reports
  generateReport: (reportType, params = {}) => {
    return apiClient.post('/api/admin/reports', { reportType, ...params });
  },
};

export default adminAPI;
