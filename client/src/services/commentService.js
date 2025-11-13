import api from './apiClient';

export const fetchComments = async (postId) => {
  const response = await api.get(`/api/posts/${postId}/comments`);
  return response.data;
};

export const createComment = async ({ postId, payload }) => {
  const response = await api.post(`/api/posts/${postId}/comments`, payload);
  return response.data;
};

export const deleteComment = async ({ postId, commentId }) => {
  await api.delete(`/api/posts/${postId}/comments/${commentId}`);
  return { success: true };
};

