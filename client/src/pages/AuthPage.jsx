import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext.jsx';

const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6).required('Password is required'),
});

const registerSchema = loginSchema.shape({
  name: yup.string().required('Name is required'),
});

const AuthPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, status, error, isAuthenticated } = useAuth();
  const isLogin = type !== 'register';

  const schema = isLogin ? loginSchema : registerSchema;

  const {
    handleSubmit,
    register: registerField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    const action = isLogin ? login : register;
    try {
      await action(values);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '480px', margin: '3rem auto' }}>
      <h1 className="page-title" style={{ fontSize: '2rem', textAlign: 'center' }}>
        {isLogin ? 'Welcome back!' : 'Join our coffee community'}
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b4f3a' }}>
        {isLogin ? 'Log in to manage your brews and share tasting notes.' : 'Create an account to craft and review brews.'}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isLogin && (
          <label htmlFor="name">
            Name
            <input id="name" placeholder="Ava the Barista" {...registerField('name')} />
            {errors.name && <span className="error-text">{errors.name.message}</span>}
          </label>
        )}
        <label htmlFor="email">
          Email
          <input id="email" type="email" placeholder="you@coffeeshop.com" {...registerField('email')} />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </label>
        <label htmlFor="password">
          Password
          <input id="password" type="password" placeholder="••••••" {...registerField('password')} />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={status === 'loading'}>
          {status === 'loading' ? 'Brewing...' : isLogin ? 'Log In' : 'Create Account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        {isLogin ? (
          <>
            No account yet?
            {' '}
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/auth/register')}>
              Register
            </button>
          </>
        ) : (
          <>
            Already part of the crew?
            {' '}
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/auth/login')}>
              Sign In
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthPage;

