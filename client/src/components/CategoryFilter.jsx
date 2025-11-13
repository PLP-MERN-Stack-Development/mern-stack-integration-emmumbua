import { usePostsFilter } from '../context/PostContext.jsx';
import { useApiQuery } from '../hooks/useApi.js';
import { fetchCategories } from '../services/categoryService.js';

const CategoryFilter = () => {
  const { filters, setCategory } = usePostsFilter();
  const { data, isLoading, error } = useApiQuery(['categories'], fetchCategories);

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>Failed to load categories.</p>;
  }

  const categories = data?.data || [];

  return (
    <div className="category-filter">
      <button
        type="button"
        className={`pill ${filters.category === 'all' ? 'active' : ''}`}
        onClick={() => setCategory('all')}
      >
        All Origins
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          className={`pill ${filters.category === category._id || filters.category === category.slug ? 'active' : ''}`}
          onClick={() => setCategory(category.slug || category._id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

