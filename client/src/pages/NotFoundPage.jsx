import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="card" style={{ maxWidth: '640px', margin: '3rem auto', textAlign: 'center' }}>
      <h1 className="page-title" style={{ fontSize: '3rem' }}>404</h1>
      <p className="page-subtitle">We couldn&apos;t find that brew.</p>
      <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
        Return Home
      </button>
    </div>
  );
};

export default NotFoundPage;

