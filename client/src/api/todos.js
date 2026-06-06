import apiClient from './client';

export const todosAPI = {
  getAll: () => apiClient.get('/api/todos'),
  create: (data) => apiClient.post('/api/todos', data),
  update: (id, updates) => apiClient.put(`/api/todos/${id}`, updates),
  delete: (id) => apiClient.delete(`/api/todos/${id}`),
  move: (id, parentId, newOrder) => apiClient.put(`/api/todos/${id}/move`, { parentId, newOrder})
};