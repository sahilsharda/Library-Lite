import { apiClient } from './client';

export const loansAPI = {
  // Get all loans
  getAllLoans: () => {
    return apiClient.get('/api/loans');
  },

  // Get user's loans
  getUserLoans: (userId) => {
    return apiClient.get(`/api/loans/user/${userId}`);
  },

  // Get overdue loans
  getOverdueLoans: () => {
    return apiClient.get('/api/loans/overdue');
  },

  // Get a single loan by ID
  getLoanById: (id) => {
    return apiClient.get(`/api/loans/${id}`);
  },

  // Create a new loan (borrow a book)
  createLoan: (loanData) => {
    return apiClient.post('/api/loans', loanData);
  },

  // Return a book
  returnBook: (id, returnData) => {
    return apiClient.put(`/api/loans/${id}/return`, returnData);
  },

  // Update a loan
  updateLoan: (id, loanData) => {
    return apiClient.put(`/api/loans/${id}`, loanData);
  },
};

export default loansAPI;
