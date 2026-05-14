"use client";

import { useMyPostsInfiniteQuery, useUserPostsInfiniteQuery } from "@/hooks/usePostQueries";
import { FeedPostCard } from "@/components/post/FeedPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, SearchX, LayoutGrid, ListFilter, Loader2, ChevronDown, SlidersHorizontal, X, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function ProfileFeed({ userId }: { userId?: string }) {
    const { ref, inView } = useInView({ rootMargin: "100px" });
    const { user: currentUser } = useAuth();

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const [type, setType] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [sort, setSort] = useState<{ by: string; order: "asc" | "desc" }>({ by: "createdAt", order: "desc" });
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 500);

    const filters = useMemo(() => ({
        userId,
        searchTerm: debouncedSearch || undefined,
        type: type === "ALL" ? undefined : type,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        sortBy: sort.by,
        sortOrder: sort.order
    }), [userId, debouncedSearch, type, statusFilter, sort]);

    // Use appropriate hook based on userId presence
    const myQuery = useMyPostsInfiniteQuery(filters);
    const userQuery = useUserPostsInfiniteQuery(filters);

    const query = userId ? userQuery : myQuery;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = query;

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="space-y-6 pb-20">
            {/* Minimalistic Integrated Post & Filter Bar */}
            <div className="flex flex-col gap-4">
                <div className={`flex items-center gap-3 p-2 pl-3 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-sm ${userId ? 'justify-between' : ''}`}>
                    {!userId && (
                        <>
                            <Avatar className="h-9 w-9 border border-primary/10">
                                <AvatarImage src={currentUser?.profilePictureUrl || ""} alt={currentUser?.name || "User"} />
                                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black">
                                    {currentUser?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <Link
                                href="/post/create"
                                className="flex-1 h-9 bg-muted/20 hover:bg-muted/40 rounded-xl px-4 flex items-center text-[15px] font-bold text-muted-foreground/70 transition-all border border-white/5"
                            >
                                What's on your mind, {currentUser?.name?.split(" ")[0]}?
                            </Link>
                        </>
                    )}

                    {userId && (
                        <h3 className="text-xl font-black flex items-center gap-2 pl-2">
                            Activity
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </h3>
                    )}

                    <div className="flex items-center gap-2 pr-1">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${showFilters
                                ? "bg-primary/10 text-primary border-primary/20 shadow-inner"
                                : "bg-muted/10 text-muted-foreground border-transparent hover:bg-muted/20"
                                }`}
                        >
                            {showFilters ? <X className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
                            {showFilters ? "Close" : "Filters"}
                        </button>

                        {!userId && (
                            <Link
                                href="/post/create"
                                className="flex items-center justify-center h-9 w-9 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                <PlusCircle className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>

                {!userId && (
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            My Activity
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted/20 px-2 py-0.5 rounded-full border border-white/5">
                                {posts.length}
                            </span>
                        </h3>
                    </div>
                )}

                {/* Toggleable Filter Bar - Facebook Style */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -10 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "circOut" }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-col gap-4 p-5 rounded-[2rem] bg-muted/20 border border-white/5 shadow-inner">
                                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                                    {/* Search Bar */}
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Search activity..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-11 pl-11 pr-4 rounded-2xl bg-background/50 border-white/10 focus:bg-background focus:border-primary/30 transition-all text-sm font-medium placeholder:text-muted-foreground/40"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                                        {/* Type Filter */}
                                        <div className="relative group shrink-0">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                                <Filter className="w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <select
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="h-11 pl-9 pr-8 rounded-2xl bg-background/50 border-white/10 text-xs font-black uppercase tracking-widest outline-none focus:border-primary/30 appearance-none cursor-pointer hover:bg-white/[0.08] transition-all"
                                            >
                                                <option value="ALL">All Types</option>
                                                <option value="DONATION">Donations</option>
                                                <option value="REQUEST">Requests</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                        </div>

                                        {/* Status Filter */}
                                        <div className="relative group shrink-0">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                                <ListFilter className="w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="h-11 pl-9 pr-8 rounded-2xl bg-background/50 border-white/10 text-xs font-black uppercase tracking-widest outline-none focus:border-primary/30 appearance-none cursor-pointer hover:bg-white/[0.08] transition-all"
                                            >
                                                <option value="ALL">All Status</option>
                                                <option value="AVAILABLE">Available</option>
                                                <option value="PENDING_HANDOVER">Pending</option>
                                                <option value="COMPLETED">Completed</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                        </div>

                                        {/* Sort */}
                                        <div className="relative group shrink-0">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                                <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <select
                                                value={`${sort.by}-${sort.order}`}
                                                onChange={(e) => {
                                                    const [by, order] = e.target.value.split("-") as [string, "asc" | "desc"];
                                                    setSort({ by, order });
                                                }}
                                                className="h-11 pl-9 pr-8 rounded-2xl bg-background/50 border-white/10 text-xs font-black uppercase tracking-widest outline-none focus:border-primary/30 appearance-none cursor-pointer hover:bg-white/[0.08] transition-all"
                                            >
                                                <option value="createdAt-desc">Newest First</option>
                                                <option value="createdAt-asc">Oldest First</option>
                                                <option value="quantity-desc">Highest Quantity</option>
                                                <option value="quantity-asc">Lowest Quantity</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Active Filters Chips */}
                                {(debouncedSearch || type !== "ALL" || statusFilter !== "ALL" || sort.by !== "createdAt" || sort.order !== "desc") && (
                                    <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
                                        {debouncedSearch && (
                                            <div className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-full border border-primary/20 flex items-center gap-2">
                                                <span>Search: {debouncedSearch}</span>
                                                <button onClick={() => setSearchTerm("")} className="hover:text-white transition-colors">✕</button>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => { setSearchTerm(""); setType("ALL"); setStatusFilter("ALL"); setSort({ by: "createdAt", order: "desc" }); }}
                                            className="text-[9px] font-black text-muted-foreground hover:text-primary transition-colors px-3 py-1 hover:bg-white/5 rounded-full uppercase tracking-widest"
                                        >
                                            Reset All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-8">
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
                    </div>
                ) : isError ? (
                    <div className="text-center py-16 glass-panel rounded-[2rem] border-white/10">
                        <p className="font-bold text-muted-foreground">Failed to load posts. Please try again.</p>
                    </div>
                ) : (
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
                                        We couldn't find any activity matching your current filters. Start sharing with the community!
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
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
