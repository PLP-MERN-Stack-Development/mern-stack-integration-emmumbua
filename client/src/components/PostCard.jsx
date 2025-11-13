import './PostCard.css';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onToggleLike, isLiked }) => {
  return (
    <article className="card">
      {post.featuredImage && (
        <div className="card-media">
          <img src={post.featuredImage} alt={post.title} />
        </div>
      )}
      <div className="card-body">
        <div className="card-meta">
          {post.categories?.map((category) => (
            <span key={category._id} className="badge">{category.name}</span>
          ))}
          <span className="pill">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
        <h3 className="card-title">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="card-excerpt">{post.excerpt || post.content?.slice(0, 120)}...</p>
        <div className="card-footer">
          <div className="card-author">
            <span>{post.author?.name || 'Coffee Artisan'}</span>
            {post.price ? <strong>${post.price.toFixed(2)}</strong> : null}
          </div>
          <div className="card-actions">
            <button
              type="button"
              className={`btn btn-secondary ${isLiked ? 'liked' : ''}`}
              onClick={() => onToggleLike?.(post)}
            >
              {isLiked ? '♥ Liked' : '♡ Like'} ({post.likes?.length || 0})
            </button>
            <Link to={`/posts/${post.slug}`} className="btn btn-primary">
              Brew Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;

