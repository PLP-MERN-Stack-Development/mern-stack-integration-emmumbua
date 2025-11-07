import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card">
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '16px'
          }}
        />
      )}
      
      <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>
        <Link 
          to={`/posts/${post._id}`} 
          style={{ textDecoration: 'none', color: '#1f2937' }}
        >
          {post.title}
        </Link>
      </h3>
      
      {post.excerpt && (
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '16px',
          lineHeight: '1.5'
        }}>
          {post.excerpt}
        </p>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <span>By {post.author.name}</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
      
      {post.categories && post.categories.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          {post.categories.map(category => (
            <span
              key={category._id}
              style={{
                display: 'inline-block',
                backgroundColor: category.color || '#6b7280',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                marginRight: '8px'
              }}
            >
              {category.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;