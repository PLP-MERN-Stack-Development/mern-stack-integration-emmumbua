import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from './SearchBar.jsx';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">
          <NavLink to="/">Coffee Shop Hub</NavLink>
        </div>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          {hasRole('admin') && <NavLink to="/admin/posts/new">New Beverage</NavLink>}
          {hasRole('barista') && <NavLink to="/admin/posts/new">New Beverage</NavLink>}
        </nav>
        <SearchBar />
        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <NavLink to="/profile">{user?.name}</NavLink>
              <button type="button" onClick={handleLogout} className="btn-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/auth/login">Login</NavLink>
              <NavLink to="/auth/register">Register</NavLink>
            </>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Coffee Shop Hub. Crafted with ☕ and React.</p>
      </footer>
    </div>
  );
};

export default Layout;

