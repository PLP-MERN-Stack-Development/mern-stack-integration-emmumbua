import './CommentList.css';
import { formatDistanceToNow } from 'date-fns';

const CommentList = ({ comments, currentUserId, onDelete }) => {
  if (!comments || comments.length === 0) {
    return <p>No tasting notes yet. Be the first to share!</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment._id} className="comment-item card">
          <div className="comment-header">
            <div>
              <strong>{comment.author?.name || 'Coffee Lover'}</strong>
              <span className="pill">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            {typeof comment.rating === 'number' && (
              <span className="badge">{'★'.repeat(comment.rating)}</span>
            )}
          </div>
          <p>{comment.content}</p>
          {onDelete && comment.author?._id === currentUserId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onDelete(comment)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;

