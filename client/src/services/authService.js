import api from './apiClient';

export const register = async (payload) => {
  const response = await api.post('/api/auth/register', payload);
  if (response.data?.data?.token) {
    localStorage.setItem('coffee_shop_token', response.data.data.token);
  }
  return response.data;
};

export const login = async (payload) => {
  const response = await api.post('/api/auth/login', payload);
  if (response.data?.data?.token) {
    localStorage.setItem('coffee_shop_token', response.data.data.token);
  }
  return response.data;
};

export const logout = async () => {
  await api.post('/api/auth/logout');
  localStorage.removeItem('coffee_shop_token');
  return { success: true };
};

export const getProfile = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.put('/api/auth/me', payload);
  return response.data;
};

