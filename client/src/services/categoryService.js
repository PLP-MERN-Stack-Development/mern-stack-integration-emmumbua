import api from './apiClient';

export const fetchCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await api.post('/api/categories', payload);
  return response.data;
};

export const updateCategory = async ({ id, ...payload }) => {
  const response = await api.put(`/api/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/api/categories/${id}`);
  return { success: true };
};

