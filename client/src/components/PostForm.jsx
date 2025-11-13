import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApiQuery } from '../hooks/useApi.js';
import { fetchCategories } from '../services/categoryService.js';

const schema = yup.object({
  title: yup.string().required('A beverage title is required'),
  content: yup.string().required('Please describe the coffee in detail'),
  excerpt: yup.string(),
  price: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .min(0, 'Price must be positive')
    .nullable(),
  status: yup.string().oneOf(['draft', 'published']),
  categories: yup.array().of(yup.string()).min(1, 'Select at least one category'),
});

const PostForm = ({ defaultValues, onSubmit, isSubmitting }) => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      price: '',
      status: 'draft',
      categories: [],
      tags: '',
      featuredImage: null,
    },
  });

  const { data, isLoading } = useApiQuery(['categories'], fetchCategories);

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        categories: defaultValues.categories?.map((category) => category._id || category) || [],
        tags: defaultValues.tags?.join(', ') || '',
      });
    }
  }, [defaultValues, reset]);

  const handleImageChange = (event) => {
    setValue('featuredImage', event.target.files[0]);
  };

  const submitHandler = (values) => {
    const payload = { ...values };
    if (typeof payload.tags === 'string') {
      payload.tags = payload.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
    onSubmit(payload);
  };

  const categories = data?.data || [];
  const selectedCategories = watch('categories');

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="card">
      <div className="form-row">
        <label htmlFor="title">
          Beverage Title
          <input id="title" placeholder="Ethiopian Yirgacheffe Pour Over" {...register('title')} />
          {errors.title && <span className="error-text">{errors.title.message}</span>}
        </label>
        <label htmlFor="status">
          Status
          <select id="status" {...register('status')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label htmlFor="excerpt">
        Short Description
        <textarea id="excerpt" rows={2} placeholder="A floral, tea-like brew..." {...register('excerpt')} />
      </label>

      <label htmlFor="content">
        Brewing Story
        <textarea id="content" rows={8} placeholder="Share the origin, tasting notes, brewing method..." {...register('content')} />
        {errors.content && <span className="error-text">{errors.content.message}</span>}
      </label>

      <div className="form-row">
        <label htmlFor="price">
          Price
          <input id="price" type="number" step="0.01" placeholder="4.50" {...register('price')} />
          {errors.price && <span className="error-text">{errors.price.message}</span>}
        </label>
        <label htmlFor="tags">
          Tags (comma separated)
          <input id="tags" placeholder="cold brew, single origin" {...register('tags')} />
        </label>
      </div>

      <label htmlFor="categories">
        Categories
        <div className="category-select">
          {isLoading ? (
            <p>Loading categories...</p>
          ) : (
            categories.map((category) => (
              <label key={category._id} className={`pill ${selectedCategories?.includes(category._id) ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  value={category._id}
                  {...register('categories')}
                  style={{ display: 'none' }}
                />
                {category.name}
              </label>
            ))
          )}
        </div>
        {errors.categories && <span className="error-text">{errors.categories.message}</span>}
      </label>

      <label htmlFor="featuredImage">
        Featured Image
        <input id="featuredImage" type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Beverage'}
      </button>
    </form>
  );
};

export default PostForm;

