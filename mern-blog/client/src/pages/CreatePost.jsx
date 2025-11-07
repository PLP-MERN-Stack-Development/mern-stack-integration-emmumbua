import React from 'react';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/Post/PostForm';

const CreatePost = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Please login to create a post.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PostForm />
    </div>
  );
};

export default CreatePost;