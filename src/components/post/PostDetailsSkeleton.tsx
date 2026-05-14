import { Skeleton } from "@/components/ui/skeleton";

export function PostDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-muted/20">
            <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Main Post Card Skeleton */}
                        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-11 w-11 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                            <div className="px-5 pb-3 space-y-3">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                            <Skeleton className="aspect-video w-full" />
                            <div className="grid grid-cols-3 border-t border-border/40 divide-x divide-border/40">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </div>

                        {/* Details Card Skeleton */}
                        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
                            <Skeleton className="h-4 w-24 mb-4" />
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                                        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                                        <div className="space-y-1.5 flex-1">
                                            <Skeleton className="h-2 w-12" />
                                            <Skeleton className="h-3 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Comments) */}
                    <div className="bg-card border border-border/60 rounded-2xl shadow-sm lg:sticky lg:top-[76px] overflow-hidden flex flex-col h-[600px]">
                        <div className="px-4 py-3.5 border-b border-border/40 flex items-center gap-2 shrink-0">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex-1 p-4 space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-16 w-full rounded-2xl" />
                                        <div className="flex gap-4">
                                            <Skeleton className="h-2 w-12" />
                                            <Skeleton className="h-2 w-12" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-border/40 p-4 shrink-0">
                            <div className="flex items-end gap-3">
                                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                <Skeleton className="h-10 flex-1 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
