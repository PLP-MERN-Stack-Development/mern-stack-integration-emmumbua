import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '16px 0',
      marginBottom: '32px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#1f2937',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            MERN Blog
          </Link>

          <nav>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '24px',
              alignItems: 'center',
              margin: 0,
              padding: 0
            }}>
              <li><Link to="/" style={{ textDecoration: 'none', color: '#374151' }}>Home</Link></li>
              <li><Link to="/posts" style={{ textDecoration: 'none', color: '#374151' }}>Posts</Link></li>
              
              {user ? (
                <>
                  <li><Link to="/create-post" style={{ textDecoration: 'none', color: '#374151' }}>Create Post</Link></li>
                  <li style={{ color: '#6b7280' }}>Hello, {user.name}</li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px' }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" style={{ textDecoration: 'none', color: '#374151' }}>Login</Link></li>
                  <li><Link to="/register" style={{ textDecoration: 'none', color: '#374151' }}>Register</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;