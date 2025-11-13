import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { login as loginUser, register as registerUser, logout as logoutUser, getProfile, updateProfile as updateProfileRequest } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | authenticated | unauthenticated
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('coffee_shop_token');
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    const fetchProfile = async () => {
      try {
        setStatus('loading');
        const { data } = await getProfile();
        setUser(data);
        setStatus('authenticated');
      } catch (err) {
        console.error(err);
        localStorage.removeItem('coffee_shop_token');
        setUser(null);
        setStatus('unauthenticated');
      }
    };

    fetchProfile();
  }, []);

  const login = async (credentials) => {
    setStatus('loading');
    setError(null);
    try {
      const { data } = await loginUser(credentials);
      setUser(data.user || data);
      setStatus('authenticated');
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setStatus('unauthenticated');
      throw err;
    }
  };

  const register = async (payload) => {
    setStatus('loading');
    setError(null);
    try {
      const { data } = await registerUser(payload);
      setUser(data.user || data);
      setStatus('authenticated');
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setStatus('unauthenticated');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  };

  const updateProfile = useCallback(async (payload) => {
    const { data: updated } = await updateProfileRequest(payload);
    setUser(updated);
    return updated;
  }, []);

  const hasRole = useCallback((role) => user?.role === role, [user]);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: status === 'authenticated',
      hasRole,
    }),
    [user, status, error, updateProfile, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

