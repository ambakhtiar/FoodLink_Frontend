import { useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "@/services/postService";

export function useMyPostsInfiniteQuery(filters?: { 
  searchTerm?: string; 
  type?: string; 
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useInfiniteQuery({
    queryKey: ["my-posts", filters],
    queryFn: ({ pageParam = 1 }) => postService.getMyPosts({ 
      page: pageParam, 
      limit: 10,
      ...filters 
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useUserPostsInfiniteQuery(filters?: { 
  userId?: string;
  searchTerm?: string; 
  type?: string; 
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useInfiniteQuery({
    queryKey: ["user-posts", filters],
    queryFn: ({ pageParam = 1 }) => postService.getAllPosts({ 
      page: pageParam, 
      limit: 10,
      ...filters 
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!filters?.userId,
  });
}
