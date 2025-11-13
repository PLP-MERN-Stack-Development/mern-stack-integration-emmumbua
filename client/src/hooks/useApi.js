import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useApiQuery = (key, queryFn, options = {}) => {
  return useQuery({
    queryKey: key,
    queryFn,
    retry: options.retry ?? 1,
    staleTime: options.staleTime ?? 1000 * 60,
    ...options,
  });
};

export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onError: options.onError,
    onMutate: options.onMutate,
    onSettled: options.onSettled,
    onSuccess: options.onSuccess,
    ...options,
    onSuccess: async (...args) => {
      await options.onSuccess?.(...args);
      if (options.invalidateQueries) {
        const queries = Array.isArray(options.invalidateQueries)
          ? options.invalidateQueries
          : [options.invalidateQueries];
        queries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
        });
      }
    },
  });
};

