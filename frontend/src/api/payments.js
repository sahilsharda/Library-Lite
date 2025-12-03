import { apiClient } from "./client";

export const paymentsAPI = {
  // Get all payments
  getAllPayments: () => {
    return apiClient.get("/payments");
  },

  // Get user's payments
  getUserPayments: (userId) => {
    return apiClient.get(`/payments/user/${userId}`);
  },

  // Create a new payment
  createPayment: (paymentData) => {
    return apiClient.post("/payments", paymentData);
  },

  // Update payment status
  updatePaymentStatus: (id, status) => {
    return apiClient.put(`/payments/${id}/status`, { status });
  },
};

export default paymentsAPI;
