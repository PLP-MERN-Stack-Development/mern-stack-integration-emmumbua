import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { data: post, loading, error, execute: fetchPost } = useApi(() => 
    postsAPI.getPost(id)
  );
  
  const { data: comments, execute: fetchComments } = useApi(() => 
    postsAPI.getPostComments(id)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await commentsAPI.createComment({
        content: comment,
        postId: id
      });
      setComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        navigate('/posts');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) return <div className="container loading">Loading post...</div>;
  if (error) return <div className="container alert alert-error">{error}</div>;
  if (!post) return <div className="container">Post not found</div>;

  const canEdit = user && (user._id === post.author._id || user.role === 'admin');

  return (
    <div className="container">
      <article className="card">
        {canEdit && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginBottom: '16px',
            justifyContent: 'flex-end'
          }}>
            <Link 
              to={`/edit-post/${post._id}`}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              Edit
            </Link>
            <button 
              onClick={handleDeletePost}
              className="btn btn-danger"
              style={{ padding: '8px 16px' }}
            >
              Delete
            </button>
          </div>
        )}

        {post.featuredImage && (
          <img 
            src={post.featuredImage} 
            alt={post.title}
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '24px'
            }}
          />
        )}
        
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '16px',
            color: '#1f2937'
          }}>
            {post.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>By {post.author.name}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.viewCount > 0 && (
                <>
                  <span>•</span>
                  <span>{post.viewCount} views</span>
                </>
              )}
            </div>
            
            {post.categories && post.categories.length > 0 && (
              <div>
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
                      marginLeft: '8px'
                    }}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div 
          style={{
            lineHeight: '1.8',
            fontSize: '16px',
            color: '#374151'
          }}
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
        />

        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <strong>Tags: </strong>
            {post.tags.map((tag, index) => (
              <span key={index} style={{ marginLeft: '8px' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Comments Section */}
      <section className="card" style={{ marginTop: '32px' }}>
        <h3 style={{ marginBottom: '24px' }}>
          Comments ({comments?.data?.length || 0})
        </h3>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-textarea"
                placeholder="Add a comment..."
                rows="3"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Please <Link to="/login">login</Link> to post a comment.
          </p>
        )}

        {/* Comments List */}
        {comments?.data && comments.data.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.data.map(comment => (
              <div 
                key={comment._id}
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <strong>{comment.author.name}</strong>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p style={{ margin: 0, lineHeight: '1.5' }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6b7280', textAlign: 'center' }}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </section>
    </div>
  );
};

export default PostDetail;