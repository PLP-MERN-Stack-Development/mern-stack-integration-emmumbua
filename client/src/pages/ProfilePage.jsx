import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext.jsx';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').optional(),
});

const ProfilePage = () => {
  const { user, updateProfile, status } = useAuth();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    },
  });

  useEffect(() => {
    reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  }, [user, reset]);

  const onSubmit = async (values) => {
    const payload = { ...values };
    if (!payload.password) {
      delete payload.password;
    }
    await updateProfile(payload);
    reset({ ...payload, password: '' });
  };

  return (
    <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <h1 className="page-title">Your Barista Profile</h1>
      <p className="page-subtitle">
        Role:
        {' '}
        <strong>{user?.role}</strong>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">
          Name
          <input id="name" placeholder="Your name" {...register('name')} />
          {errors.name && <span className="error-text">{errors.name.message}</span>}
        </label>
        <label htmlFor="email">
          Email
          <input id="email" type="email" placeholder="you@coffeeshop.com" {...register('email')} />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </label>
        <label htmlFor="password">
          New Password
          <input id="password" type="password" placeholder="Leave blank to keep current password" {...register('password')} />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </label>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || status === 'loading'}>
          {isSubmitting ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;

