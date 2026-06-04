import apiClient from './client';

export const groupsAPI = {
  getAll: () => apiClient.get('/api/groups'),
  create: (data) => apiClient.post('/api/groups', data),
  update: (id, data) => apiClient.put(`/api/groups/${id}`, data),
  delete: (id) => apiClient.delete(`/api/groups/${id}`)
};