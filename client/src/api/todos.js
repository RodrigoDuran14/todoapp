import apiClient from './client';

export const todosAPI = {
  getAll: () => apiClient.get('/api/todos'),
  create: (text) => apiClient.post('/api/todos', { text }),
  update: (id, updates) => apiClient.put(`/api/todos/${id}`, updates),
  delete: (id) => apiClient.delete(`/api/todos/${id}`),
};