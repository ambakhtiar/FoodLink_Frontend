"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useMyPostsInfiniteQuery } from "@/hooks/usePostQueries";
import { FeedPostCard } from "@/components/post/FeedPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FeedHeader } from "@/components/post/FeedHeader";

export function ProfileFeed() {
    const { ref, inView } = useInView({ rootMargin: "100px" });
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useMyPostsInfiniteQuery();

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page.data) || [];
    const isEmpty = status === "success" && posts.length === 0;

    if (status === "pending") {
        return (
            <div className="space-y-6">
                <FeedHeader />
                {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="text-center py-16 glass-panel rounded-[2rem] border-white/10">
                <p className="font-bold text-muted-foreground">Failed to load posts. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <FeedHeader />
            
            <h3 className="text-xl font-black px-1 flex items-center gap-3">
                My Recent Activity
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </h3>
            
            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <FeedPostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 px-6 glass-panel rounded-[2rem] border-white/10 border-dashed"
                        >
                            <div className="p-6 bg-primary/10 rounded-full mb-6">
                                <SearchX className="w-12 h-12 text-primary" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black">No activity yet</h3>
                                <p className="text-muted-foreground font-medium max-w-sm">
                                    You haven't posted any donations or requests. Start sharing with the community!
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Infinite scroll trigger */}
            <div ref={ref} className="flex items-center justify-center h-20">
                {isFetchingNextPage && (
                    <div className="flex items-center gap-3 glass-panel px-6 py-3 rounded-full text-sm font-black text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading more insights...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function PostSkeleton() {
    return (
        <div className="glass-panel border-white/10 rounded-[2rem] overflow-hidden">
            <div className="flex items-center gap-4 p-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="px-6 pb-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="aspect-video w-full" />
            <div className="flex p-4 gap-4">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>
        </div>
    );
}
