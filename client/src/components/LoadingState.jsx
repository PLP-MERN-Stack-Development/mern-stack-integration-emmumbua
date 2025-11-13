const LoadingState = ({ message = 'Brewing something delightful...' }) => (
  <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
    <p>{message}</p>
  </div>
);

export default LoadingState;

