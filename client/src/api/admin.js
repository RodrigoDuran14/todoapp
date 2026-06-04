import apiClient from './client';

export const adminAPI = {
  getUsers: () => apiClient.get('/api/admin/users'),
  updateUserRole: (userId, role) => apiClient.put(`/api/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => apiClient.delete(`/api/admin/users/${userId}`),
  getAllTodos: () => apiClient.get('/api/admin/todos'),
  deleteAnyTodo: (todoId) => apiClient.delete(`/api/admin/todos/${todoId}`),
};