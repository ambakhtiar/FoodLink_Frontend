import { useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "@/services/postService";

export function useMyPostsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ["my-posts"],
    queryFn: ({ pageParam = 1 }) => postService.getMyPosts({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
