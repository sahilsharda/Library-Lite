import { apiClient } from './client';

export const booksAPI = {
  // Get all books with optional search and filter
  getAllBooks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/books${queryString ? `?${queryString}` : ''}`);
  },

  // Get a single book by ID
  getBookById: (id) => {
    return apiClient.get(`/api/books/${id}`);
  },

  // Create a new book (admin only)
  createBook: (bookData) => {
    return apiClient.post('/api/books', bookData);
  },

  // Update a book by ID (admin only)
  updateBook: (id, bookData) => {
    return apiClient.put(`/api/books/${id}`, bookData);
  },

  // Delete a book by ID (admin only)
  deleteBook: (id) => {
    return apiClient.delete(`/api/books/${id}`);
  },
};

export default booksAPI;
