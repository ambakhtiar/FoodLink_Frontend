"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { postService } from "@/services/postService";
import { FeedPostCard } from "./FeedPostCard";
import { FeedHeader } from "./FeedHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, SearchX, Search, SlidersHorizontal, Sparkles, TrendingUp, Users, Gift, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCategory, PostType } from "@/types/post";
import { useDebounce } from "use-debounce";
import Link from "next/link";

// ── Filter state type ─────────────────────────────────────────────────────────
interface FilterState {
    searchTerm?: string;
    category?: string;
    type?: string;
    sortBy: string;
}

// ── Main Feed Component ───────────────────────────────────────────────────────
export function Feed() {
    const { ref, inView } = useInView({ rootMargin: "100px" });
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: undefined,
        category: undefined,
        type: undefined,
        sortBy: "createdAt",
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["posts", filters],
        queryFn: ({ pageParam = 1 }) =>
            postService.getAllPosts({ ...filters, page: pageParam as number, limit: 8 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
    });

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page.data) || [];
    const isEmpty = status === "success" && posts.length === 0;

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* 3-column layout: desktop only sidebars */}
                <div className="flex gap-5 items-start">

                    {/* ── LEFT SIDEBAR ──────────────────────────── */}
                    <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[76px] space-y-4">
                        <LeftSidebar filters={filters} onFilterChange={setFilters} />
                    </aside>

                    {/* ── MAIN FEED COLUMN ──────────────────────── */}
                    <main className="flex-1 min-w-0 space-y-4">
                        {/* Mobile: top search bar + filter chips */}
                        <div className="lg:hidden space-y-3">
                            <MobileSearchBar filters={filters} onFilterChange={setFilters} />
                        </div>

                        {/* Create post prompt */}
                        <FeedHeader />

                        {/* Feed cards */}
                        {status === "pending" ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
                            </div>
                        ) : status === "error" ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <p className="font-semibold">Failed to load feed. Please refresh.</p>
                            </div>
                        ) : isEmpty ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-20 space-y-5 bg-card rounded-2xl border border-dashed border-border"
                            >
                                <div className="p-5 bg-primary/10 rounded-full">
                                    <SearchX className="w-10 h-10 text-primary" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-xl font-bold">No posts found</h3>
                                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setFilters({ sortBy: "createdAt" })}>
                                    Clear Filters
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {posts.map((post) => (
                                        <FeedPostCard key={post.id} post={post} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Infinite scroll trigger */}
                        <div ref={ref} className="flex items-center justify-center h-16">
                            {isFetchingNextPage && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Loading more...</span>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* ── RIGHT SIDEBAR ─────────────────────────── */}
                    <aside className="hidden md:block w-[240px] shrink-0 sticky top-[76px] space-y-4">
                        <RightSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}

// ── LEFT SIDEBAR (Filters) ────────────────────────────────────────────────────
function LeftSidebar({ filters, onFilterChange }: { filters: FilterState; onFilterChange: (f: FilterState) => void }) {
    const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
    const [debouncedSearch] = useDebounce(searchTerm, 400);

    useEffect(() => {
        onFilterChange({ ...filters, searchTerm: debouncedSearch || undefined });
    }, [debouncedSearch]);

    const categories = [
        { value: "ALL", label: "All Categories" },
        ...Object.values(PostCategory).map((v) => ({ value: v, label: v.replace(/_/g, " ") })),
    ];

    const types = [
        { value: "ALL", label: "All Types" },
        { value: PostType.DONATION, label: "🍱 Donations" },
        { value: PostType.REQUEST, label: "🙏 Requests" },
    ];

    const sortOptions = [
        { value: "createdAt", label: "Newest First" },
        { value: "likesCount", label: "Most Liked" },
    ];

    const setFilter = (key: keyof FilterState, value: string) => {
        onFilterChange({ ...filters, [key]: value === "ALL" ? undefined : value });
    };

    return (
        <>
            {/* Search */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> Search
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search posts..."
                        className="pl-9 h-9 rounded-xl border-border/60 text-sm"
                    />
                </div>
            </div>

            {/* Sort */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By
                </h3>
                <div className="space-y-1">
                    {sortOptions.map((opt) => (
                        <FilterChip
                            key={opt.value}
                            label={opt.label}
                            active={filters.sortBy === opt.value}
                            onClick={() => onFilterChange({ ...filters, sortBy: opt.value })}
                        />
                    ))}
                </div>
            </div>

            {/* Type */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" /> Post Type
                </h3>
                <div className="space-y-1">
                    {types.map((t) => (
                        <FilterChip
                            key={t.value}
                            label={t.label}
                            active={(filters.type ?? "ALL") === t.value}
                            onClick={() => setFilter("type", t.value)}
                        />
                    ))}
                </div>
            </div>

            {/* Category */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Category
                </h3>
                <div className="space-y-1">
                    {categories.map((cat) => (
                        <FilterChip
                            key={cat.value}
                            label={cat.label}
                            active={(filters.category ?? "ALL") === cat.value}
                            onClick={() => setFilter("category", cat.value)}
                        />
                    ))}
                </div>
            </div>

            {/* Clear */}
            {(filters.category || filters.type || filters.searchTerm) && (
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl text-xs"
                    onClick={() => { setSearchTerm(""); onFilterChange({ sortBy: "createdAt" }); }}
                >
                    Clear All Filters
                </Button>
            )}
        </>
    );
}

// ── RIGHT SIDEBAR (Sponsored / Stats) ────────────────────────────────────────
function RightSidebar() {
    const stats = [
        { icon: Users, label: "Community Members", value: "12.4k", color: "text-primary" },
        { icon: Gift, label: "Donations Made", value: "3.2k", color: "text-emerald-500" },
        { icon: TrendingUp, label: "Requests Fulfilled", value: "89%", color: "text-amber-500" },
    ];

    return (
        <>
            {/* Community Stats */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Community</h3>
                </div>
                <div className="space-y-3">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                <span className="text-xs text-muted-foreground">{stat.label}</span>
                            </div>
                            <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sponsored */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sponsored</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-primary/50" />
                </div>
                <div className="space-y-2">
                    <div className="w-full h-28 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Gift className="w-10 h-10 text-primary/30" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Support Zero Hunger in Bangladesh</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Help us reach 50,000 families in need by the end of this year.
                    </p>
                    <Button size="sm" className="w-full h-8 text-xs rounded-xl">
                        Learn More
                    </Button>
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Quick Actions</h3>
                <Link href="/post/create" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                        <Gift className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Create a Donation</span>
                </Link>
                <Link href="/post/create" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group">
                    <div className="p-1.5 bg-amber-500/10 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Post a Request</span>
                </Link>
            </div>

            <p className="text-[10px] text-muted-foreground/40 text-center px-2">
                HelpShare · Community Guidelines · Privacy
            </p>
        </>
    );
}

// ── Mobile Search + Filter Bar ────────────────────────────────────────────────
function MobileSearchBar({ filters, onFilterChange }: { filters: FilterState; onFilterChange: (f: FilterState) => void }) {
    const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
    const [debouncedSearch] = useDebounce(searchTerm, 400);

    useEffect(() => {
        onFilterChange({ ...filters, searchTerm: debouncedSearch || undefined });
    }, [debouncedSearch]);

    const activeType = filters.type;
    const activeSortBy = filters.sortBy;

    return (
        <div className="space-y-2.5">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts..."
                    className="pl-9 h-10 rounded-xl bg-card border-border/60 text-sm"
                />
            </div>
            {/* Horizontal scrollable chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {/* Sort chips */}
                <FilterPill label="Newest" active={activeSortBy === "createdAt"} onClick={() => onFilterChange({ ...filters, sortBy: "createdAt" })} />
                <FilterPill label="Most Liked" active={activeSortBy === "likesCount"} onClick={() => onFilterChange({ ...filters, sortBy: "likesCount" })} />
                <div className="w-px h-6 bg-border/50 self-center shrink-0" />
                {/* Type chips */}
                <FilterPill label="All" active={!activeType} onClick={() => onFilterChange({ ...filters, type: undefined })} />
                <FilterPill label="🍱 Donations" active={activeType === PostType.DONATION} onClick={() => onFilterChange({ ...filters, type: PostType.DONATION })} />
                <FilterPill label="🙏 Requests" active={activeType === PostType.REQUEST} onClick={() => onFilterChange({ ...filters, type: PostType.REQUEST })} />
            </div>
        </div>
    );
}

// ── FilterChip (sidebar vertical) ────────────────────────────────────────────
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
        >
            {label}
        </button>
    );
}

// ── FilterPill (mobile horizontal) ───────────────────────────────────────────
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap ${
                active
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
        >
            {label}
        </button>
    );
}

// ── Post Skeleton ─────────────────────────────────────────────────────────────
function PostSkeleton() {
    return (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <div className="px-4 pb-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3.5 w-full" />
            </div>
            <Skeleton className="aspect-video w-full" />
            <div className="flex divide-x divide-border/50 border-t border-border/50">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
            </div>
        </div>
    );
}
