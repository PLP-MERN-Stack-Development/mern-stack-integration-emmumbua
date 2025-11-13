import { useEffect, useState } from 'react';
import { usePostsFilter } from '../context/PostContext.jsx';

const SearchBar = () => {
  const { filters, setSearch } = usePostsFilter();
  const [value, setValue] = useState(filters.search);

  useEffect(() => {
    setValue(filters.search);
  }, [filters.search]);

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search beverages, origins, brew guides..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setSearch(value);
          }
        }}
      />
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setSearch(value)}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;

