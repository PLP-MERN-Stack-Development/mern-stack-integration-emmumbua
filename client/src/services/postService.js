import api from './apiClient';

export const fetchPosts = async (params = {}) => {
  const response = await api.get('/api/posts', { params });
  return response.data;
};

export const fetchPostBySlug = async (slug) => {
  const response = await api.get(`/api/posts/slug/${slug}`);
  return response.data;
};

export const fetchPostById = async (id) => {
  const response = await api.get(`/api/posts/${id}`);
  return response.data;
};

export const createPost = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await api.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updatePost = async ({ id, data }) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await api.put(`/api/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deletePost = async (id) => {
  await api.delete(`/api/posts/${id}`);
  return { success: true };
};

export const toggleLikePost = async (id) => {
  const response = await api.post(`/api/posts/${id}/toggle-like`);
  return response.data;
};

