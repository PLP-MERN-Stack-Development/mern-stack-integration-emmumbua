import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { useApiMutation, useApiQuery } from '../hooks/useApi.js';
import { createPost, fetchPostById, updatePost } from '../services/postService.js';

const PostEditorPage = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = mode === 'edit';

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useApiQuery(['post-edit', id], () => fetchPostById(id), {
    enabled: isEditMode && Boolean(id),
  });

  const defaultValues = useMemo(() => {
    if (!data?.data) return undefined;
    const post = data.data;
    return {
      ...post,
      categories: post.categories || [],
    };
  }, [data]);

  const createMutation = useApiMutation(createPost, {
    invalidateQueries: ['posts'],
    onSuccess: ({ data: created }) => {
      navigate(`/posts/${created.slug}`);
    },
  });

  const updateMutation = useApiMutation(({ id: postId, data: payload }) => updatePost({ id: postId, data: payload }), {
    invalidateQueries: ['posts'],
    onSuccess: ({ data: updated }) => {
      navigate(`/posts/${updated.slug}`);
    },
  });

  const handleSubmit = (values) => {
    const payload = { ...values };
    if (payload.categories) {
      payload.categories = payload.categories.filter(Boolean);
    }
    const featuredImage = payload.featuredImage;
    if (featuredImage instanceof File) {
      payload.featuredImage = featuredImage;
    }

    if (isEditMode) {
      updateMutation.mutate({ id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isEditMode && isLoading) {
    return <LoadingState message="Fetching brew details..." />;
  }

  if (isEditMode && isError) {
    return <ErrorState message="Failed to load the beverage." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <h1 className="page-title">{isEditMode ? 'Update Beverage' : 'Create Beverage Story'}</h1>
      <PostForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default PostEditorPage;

