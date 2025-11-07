import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { postsAPI, categoriesAPI } from '../services/api';
import PostCard from '../components/Post/PostCard';

const Posts = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  
  const { data: postsData, loading, error, execute: fetchPosts } = useApi(() => 
    postsAPI.getPosts({ page, limit: 9, search, category })
  );

  const { data: categoriesData } = useApi(categoriesAPI.getCategories);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchPosts();
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '24px' }}>All Posts</h1>
        
        <form onSubmit={handleSearch} style={{ 
          display: 'grid', 
          gap: '16px',
          gridTemplateColumns: '1fr auto auto',
          alignItems: 'end'
        }}>
          <div className="form-group">
            <label className="form-label">Search Posts</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              placeholder="Search by title or content..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categoriesData?.data?.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {loading && <div className="loading">Loading posts...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      
      {postsData && (
        <>
          <div className="grid grid-3">
            {postsData.data.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          
          {postsData.pagination && postsData.pagination.pages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '8px',
              marginTop: '32px'
            }}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              
              <span style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '0 16px'
              }}>
                Page {page} of {postsData.pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= postsData.pagination.pages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {postsData && postsData.data.length === 0 && (
        <div className="text-center">
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            No posts found. {search || category ? 'Try changing your search criteria.' : 'Be the first to create a post!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Posts;