import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePostsFilter } from '../context/PostContext.jsx';
import { useApiMutation, useApiQuery } from '../hooks/useApi.js';
import { fetchPosts, toggleLikePost } from '../services/postService.js';
import PostCard from '../components/PostCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Pagination from '../components/Pagination.jsx';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { filters, setPage } = usePostsFilter();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    const params = {
      page: filters.page,
      limit: filters.limit,
      status: filters.status,
      sort: filters.sort,
    };
    if (filters.search) {
      params.q = filters.search;
    }
    if (filters.category && filters.category !== 'all') {
      params.category = filters.category;
    }
    return params;
  }, [filters]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useApiQuery(['posts', queryParams], () => fetchPosts(queryParams), {
    keepPreviousData: true,
  });

  const posts = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1 };

  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useApiMutation(toggleLikePost, {
    invalidateQueries: ['posts'],
    onMutate: async (postId) => {
      if (!isAuthenticated) {
        throw new Error('Login required to like');
      }
      await queryClient.cancelQueries({ queryKey: ['posts', queryParams] });
      const previous = queryClient.getQueryData(['posts', queryParams]);
      queryClient.setQueryData(['posts', queryParams], (oldData) => {
        if (!oldData) return oldData;
        const updatedPosts = oldData.data.map((post) => {
          if (post._id !== postId) return post;
          const likedByUser = post.likes?.some((like) => (typeof like === 'string' ? like : like?._id) === user?._id);
          const likes = likedByUser
            ? post.likes.filter((like) => (typeof like === 'string' ? like : like?._id) !== user?._id)
            : [...(post.likes || []), user?._id];
          return { ...post, likes };
        });
        return { ...oldData, data: updatedPosts };
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['posts', queryParams], context.previous);
      }
    },
  });

  const handleToggleLike = (post) => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: `/posts/${post.slug}` } } });
      return;
    }
    toggleLike(post._id);
  };

  if (isLoading) {
    return <LoadingState message="Steeping fresh coffee stories..." />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} message="We spilled some beans. Please try again." />;
  }

  return (
    <div>
      <h1 className="page-title">Coffee Shop Brew Journal</h1>
      <p className="page-subtitle">Discover curated beverages, origin stories, and brewing rituals from our baristas.</p>

      <CategoryFilter />

      {posts.length === 0 ? (
        <EmptyState
          title="No beverages match your filters"
          description="Try adjusting your search or explore another origin."
        />
      ) : (
        <>
          <div className="grid grid-3">
            {posts.map((post) => {
              const liked = post.likes?.some((like) => (typeof like === 'string' ? like : like?._id) === user?._id);
              return (
                <PostCard
                  key={post._id}
                  post={post}
                  isLiked={liked}
                  onToggleLike={handleToggleLike}
                />
              );
            })}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;

