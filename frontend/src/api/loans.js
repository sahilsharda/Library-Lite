import { apiClient } from './client';

export const loansAPI = {
  // Get all loans (librarian only)
  getAllLoans: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/loans${queryString ? `?${queryString}` : ''}`);
  },

  // Get my loans (authenticated member)
  getMyLoans: () => {
    return apiClient.get('/loans/my-loans');
  },

  // Get overdue loans (librarian only)
  getOverdueLoans: () => {
    return apiClient.get('/loans/overdue');
  },

  // Borrow a book
  borrowBook: (bookId, dueDate = null) => {
    return apiClient.post('/loans/borrow', { bookId, dueDate });
  },

  // Return a book
  returnBook: (loanId) => {
    return apiClient.post('/loans/return', { loanId });
  },

  // Get a single loan by ID
  getLoanById: (id) => {
    return apiClient.get(`/loans/${id}`);
  },
};

export default loansAPI;
