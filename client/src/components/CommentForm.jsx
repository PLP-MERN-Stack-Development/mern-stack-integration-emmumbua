import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  content: yup.string().required('Please share your tasting notes'),
  rating: yup.number().transform((value) => (Number.isNaN(value) ? undefined : value)).min(1).max(5),
});

const CommentForm = ({ onSubmit, isLoading }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: '',
      rating: 5,
    },
  });

  const submitHandler = async (values) => {
    await onSubmit(values);
    reset({ content: '', rating: 5 });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="card" style={{ marginBottom: '1.5rem' }}>
      <h3>Share your tasting notes</h3>
      <textarea
        rows={3}
        placeholder="Describe the aroma, body, acidity..."
        {...register('content')}
      />
      {errors.content && <p className="error-text">{errors.content.message}</p>}
      <label htmlFor="rating">
        Rating (1-5)
        <input type="number" min={1} max={5} {...register('rating')} />
      </label>
      {errors.rating && <p className="error-text">{errors.rating.message}</p>}
      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
};

export default CommentForm;

