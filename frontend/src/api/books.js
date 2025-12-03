import { apiClient } from "./client";

export const booksAPI = {
  // Get all books with optional search and filter
  getAllBooks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/books${queryString ? `?${queryString}` : ""}`);
  },

  // Get a single book by ID
  getBookById: (id) => {
    return apiClient.get(`/books/${id}`);
  },

  // Create a new book (admin only)
  createBook: (bookData) => {
    return apiClient.post("/books", bookData);
  },

  // Update a book by ID (admin only)
  updateBook: (id, bookData) => {
    return apiClient.put(`/books/${id}`, bookData);
  },

  // Delete a book by ID (admin only)
  deleteBook: (id) => {
    return apiClient.delete(`/books/${id}`);
  },
};

export default booksAPI;
