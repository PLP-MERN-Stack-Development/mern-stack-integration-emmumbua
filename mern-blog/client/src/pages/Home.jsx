import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { postsAPI } from '../services/api';
import PostCard from '../components/Post/PostCard';

const Home = () => {
  const { data, loading, error } = useApi(() => 
    postsAPI.getPosts({ limit: 6 })
  );

  return (
    <div className="container">
      <section style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          Welcome to MERN Blog
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#6b7280',
          maxWidth: '600px',
          margin: '0 auto 32px'
        }}>
          A modern blog application built with the MERN stack. 
          Share your thoughts, ideas, and stories with the world.
        </p>
        <Link to="/posts" className="btn btn-primary" style={{ fontSize: '16px' }}>
          Explore Posts
        </Link>
      </section>

      <section>
        <h2 style={{ marginBottom: '24px' }}>Recent Posts</h2>
        
        {loading && <div className="loading">Loading posts...</div>}
        {error && <div className="alert alert-error">{error}</div>}
        
        {data && (
          <div className="grid grid-3">
            {data.data.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/posts" className="btn btn-secondary">
            View All Posts
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;