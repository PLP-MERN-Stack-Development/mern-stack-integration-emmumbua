const ErrorState = ({ message = 'Something spilled in the brew bar.', onRetry }) => (
  <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
    <p>{message}</p>
    {onRetry && (
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;

