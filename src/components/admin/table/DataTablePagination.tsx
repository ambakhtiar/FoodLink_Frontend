"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps {
    totalPages: number;
}

export function DataTablePagination({ totalPages }: DataTablePaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = Math.max(1, Number(searchParams.get("page") ?? "1"));

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (totalPages <= 1) return null;

    // Build visible page numbers: always show first, last, current ± 1
    const getPageNumbers = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];
        const delta = 1;
        const range: number[] = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        pages.push(1);
        if (range[0] > 2) pages.push("ellipsis");
        pages.push(...range);
        if (range[range.length - 1] < totalPages - 1) pages.push("ellipsis");
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-medium">
                Page <span className="font-bold text-foreground">{currentPage}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {pages.map((page, idx) =>
                    page === "ellipsis" ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm select-none">
                            …
                        </span>
                    ) : (
                        <Button
                            key={page}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-9 w-9 rounded-xl text-sm font-bold",
                                page === currentPage && "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => goToPage(page)}
                            aria-label={`Go to page ${page}`}
                            aria-current={page === currentPage ? "page" : undefined}
                        >
                            {page}
                        </Button>
                    )
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    disabled={currentPage >= totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
