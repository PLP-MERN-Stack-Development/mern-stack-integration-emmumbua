import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext.jsx';
import { useApiMutation, useApiQuery } from '../hooks/useApi.js';
import { fetchPostBySlug, toggleLikePost, deletePost } from '../services/postService.js';
import { fetchComments, createComment, deleteComment } from '../services/commentService.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import CommentForm from '../components/CommentForm.jsx';
import CommentList from '../components/CommentList.jsx';

const PostDetailsPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useApiQuery(['post', slug], () => fetchPostBySlug(slug));

  const post = data?.data;

  const commentsQuery = useApiQuery(['comments', post?._id], () => fetchComments(post._id), {
    enabled: Boolean(post?._id),
  });

  const likeMutation = useApiMutation(toggleLikePost, {
    invalidateQueries: [['post', slug], ['posts']],
  });

  const deletePostMutation = useApiMutation(deletePost, {
    invalidateQueries: ['posts'],
    onSuccess: () => {
      navigate('/');
    },
  });

  const commentMutation = useApiMutation((payload) => createComment(payload), {
    invalidateQueries: ['comments', ['post', slug]],
  });

  const deleteCommentMutation = useApiMutation((payload) => deleteComment(payload), {
    invalidateQueries: ['comments'],
  });

  const handleLike = () => {
    if (!post) return;
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: `/posts/${slug}` } } });
      return;
    }
    likeMutation.mutate(post._id);
  };

  const handleDeletePost = () => {
    if (window.confirm('Delete this beverage story?')) {
      deletePostMutation.mutate(post._id);
    }
  };

  const handleCreateComment = async (values) => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/posts/${slug}` } });
      return;
    }
    await commentMutation.mutateAsync({ postId: post._id, payload: values });
  };

  const handleDeleteComment = (comment) => {
    deleteCommentMutation.mutate({ postId: post._id, commentId: comment._id });
  };

  const isLikedByUser = useMemo(
    () => post?.likes?.some((like) => (typeof like === 'string' ? like : like?._id) === user?._id),
    [post, user],
  );

  if (isLoading) {
    return <LoadingState message="Pouring this story..." />;
  }

  if (isError || !post) {
    return <ErrorState message="We couldn't find that beverage." onRetry={() => refetch()} />;
  }

  const comments = commentsQuery.data?.data || [];

  return (
    <article className="card" style={{ padding: '2.5rem' }}>
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          style={{ width: '100%', borderRadius: '16px', marginBottom: '1.5rem', maxHeight: '420px', objectFit: 'cover' }}
        />
      )}
      <h1 className="page-title">{post.title}</h1>
      <div className="card-meta" style={{ marginBottom: '1.5rem' }}>
        {post.categories?.map((category) => (
          <span key={category._id} className="badge">
            {category.name}
          </span>
        ))}
        <span className="pill">
          Roasted {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </span>
        {typeof post.averageRating === 'number' && (
          <span className="pill">
            ★
            {post.averageRating}
            /5
          </span>
        )}
      </div>
      <p style={{ fontSize: '1.1rem', color: '#563d2d', marginBottom: '1.5rem' }}>{post.excerpt}</p>
      <div style={{ whiteSpace: 'pre-wrap', color: '#3d2b20', marginBottom: '2rem' }}>{post.content}</div>

      <div className="card-actions" style={{ marginBottom: '2rem' }}>
        <button type="button" className={`btn btn-secondary ${isLikedByUser ? 'liked' : ''}`} onClick={handleLike}>
          {isLikedByUser ? '♥ Unlike' : '♡ Like'} ({post.likes?.length || 0})
        </button>
        {post.price ? <span className="pill">Price: ${post.price.toFixed(2)}</span> : null}
        {hasRole('barista') || hasRole('admin') ? (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/admin/posts/${post._id}/edit`)}
            >
              Edit
            </button>
            <button type="button" className="btn btn-primary" onClick={handleDeletePost}>
              Delete
            </button>
          </>
        ) : null}
      </div>

      <section>
        <h2 className="page-title" style={{ fontSize: '1.8rem' }}>Tasting Notes</h2>
        {isAuthenticated ? (
          <CommentForm onSubmit={handleCreateComment} isLoading={commentMutation.isPending} />
        ) : (
          <p>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/auth/login')}>
              Log in to share your thoughts
            </button>
          </p>
        )}
        {commentsQuery.isLoading ? (
          <LoadingState message="Fetching tasting notes..." />
        ) : (
          <CommentList
            comments={comments}
            currentUserId={user?._id}
            onDelete={isAuthenticated ? handleDeleteComment : undefined}
          />
        )}
      </section>
    </article>
  );
};

export default PostDetailsPage;

