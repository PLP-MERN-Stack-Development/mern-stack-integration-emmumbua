const EmptyState = ({ title = 'No brews yet', actionLabel, onAction, description }) => (
  <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
    <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
    {description && <p style={{ marginBottom: '1.5rem', color: '#6b4f3a' }}>{description}</p>}
    {actionLabel && (
      <button type="button" className="btn btn-primary" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;

