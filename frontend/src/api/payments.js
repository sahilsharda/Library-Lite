import { apiClient } from './client';

export const paymentsAPI = {
  // Get all payments
  getAllPayments: () => {
    return apiClient.get('/api/payments');
  },

  // Get user's payments
  getUserPayments: (userId) => {
    return apiClient.get(`/api/payments/user/${userId}`);
  },

  // Create a new payment
  createPayment: (paymentData) => {
    return apiClient.post('/api/payments', paymentData);
  },

  // Update payment status
  updatePaymentStatus: (id, status) => {
    return apiClient.put(`/api/payments/${id}/status`, { status });
  },
};

export default paymentsAPI;
