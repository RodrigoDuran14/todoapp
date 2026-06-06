import apiClient from './client';

export const adminAPI = {
  getUsers: (page = 1, limit = 10) => apiClient.get('/api/admin/users', { params: { page, limit } }),
  updateUserRole: (userId, role) => apiClient.put(`/api/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => apiClient.delete(`/api/admin/users/${userId}`),
  getAllTodos: (page = 1, limit = 10) => apiClient.get('/api/admin/todos', { params: { page, limit } }),
  deleteAnyTodo: (todoId) => apiClient.delete(`/api/admin/todos/${todoId}`),
};