import { createContext, useContext, useMemo, useReducer } from 'react';

const PostContext = createContext();

const initialState = {
  search: '',
  category: 'all',
  page: 1,
  limit: 6,
  status: 'published',
  sort: '-createdAt',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_LIMIT':
      return { ...state, limit: action.payload, page: 1 };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'RESET_FILTERS':
      return { ...initialState };
    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      filters: state,
      setSearch: (payload) => dispatch({ type: 'SET_SEARCH', payload }),
      setCategory: (payload) => dispatch({ type: 'SET_CATEGORY', payload }),
      setPage: (payload) => dispatch({ type: 'SET_PAGE', payload }),
      setLimit: (payload) => dispatch({ type: 'SET_LIMIT', payload }),
      setSort: (payload) => dispatch({ type: 'SET_SORT', payload }),
      resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    }),
    [state],
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePostsFilter = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostsFilter must be used within PostProvider');
  }
  return context;
};

