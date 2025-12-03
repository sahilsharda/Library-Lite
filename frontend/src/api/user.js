import { apiClient } from "./client";

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.dbUser?.id;
  if (!userId) throw new Error("User not found");
  return userId;
};

export const userAPI = {
  // Get user's dashboard data
  getDashboard: () => {
    const userId = getUserId();
    return apiClient.get(`/dashboard/user/${userId}`);
  },

  // Get user's borrowed books
  getMyBooks: () => {
    const userId = getUserId();
    return apiClient.get(`/loans?userId=${userId}`);
  },

  // Get all available books (catalog)
  getBooks: (search = "", page = 1) => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.append("search", search);
    return apiClient.get(`/books?${params}`);
  },

  // Get user's payments (orders and payments are the same)
  getMyPayments: () => {
    const userId = getUserId();
    return apiClient.get(`/payments/user/${userId}`);
  },

  // Alias for getMyPayments
  getMyOrders: function () {
    return this.getMyPayments();
  },

  // Borrow a book
  borrowBook: (bookId, dueDate) => {
    const userId = getUserId();
    return apiClient.post("/loans/borrow", { userId, bookId, dueDate });
  },

  // Return a book
  returnBook: (loanId) => {
    return apiClient.post("/loans/return", { loanId });
  },

  // Update user profile
  updateProfile: (profileData) => {
    const userId = getUserId();
    return apiClient.put(`/users/${userId}`, profileData);
  },
};
