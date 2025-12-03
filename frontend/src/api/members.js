import { apiClient } from "./client";

export const membersAPI = {
  // Get all members
  getAllMembers: () => {
    return apiClient.get("/api/members");
  },

  // Get a single member by ID
  getMemberById: (id) => {
    return apiClient.get(`/api/members/${id}`);
  },

  // Create a new member
  createMember: (memberData) => {
    return apiClient.post("/api/members", memberData);
  },

  // Update a member by ID
  updateMember: (id, memberData) => {
    return apiClient.put(`/api/members/${id}`, memberData);
  },

  // Delete a member by ID
  deleteMember: (id) => {
    return apiClient.delete(`/api/members/${id}`);
  },
};

export default membersAPI;
