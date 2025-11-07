import React from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/Post/PostForm';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: post, loading, error } = useApi(() => postsAPI.getPost(id));

  if (loading) return <div className="container loading">Loading post...</div>;
  if (error) return <div className="container alert alert-error">{error}</div>;
  
  if (!post) return <div className="container">Post not found</div>;

  // Check if user can edit this post
  const canEdit = user && (user._id === post.author._id || user.role === 'admin');
  
  if (!canEdit) {
    return (
      <div className="container">
        <div className="alert alert-error">
          You are not authorized to edit this post.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PostForm post={post} />
    </div>
  );
};

export default EditPost;