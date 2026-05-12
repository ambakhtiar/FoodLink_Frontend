"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuRadioGroup, 
    DropdownMenuRadioItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PostCategory, PostType } from "@/types/post";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

interface FeedFiltersProps {
    onFilterChange: (filters: {
        searchTerm?: string;
        category?: string;
        type?: string;
        sortBy: string;
    }) => void;
}

export function FeedFilters({ onFilterChange }: FeedFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [category, setCategory] = useState<string>("ALL");
    const [type, setType] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<string>("createdAt");

    useEffect(() => {
        onFilterChange({
            searchTerm: debouncedSearch || undefined,
            category: category === "ALL" ? undefined : category,
            type: type === "ALL" ? undefined : type,
            sortBy: sortBy as string,
        });
    }, [debouncedSearch, category, type, sortBy]);

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Search help, food, or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl font-bold focus-visible:ring-primary/20 transition-all"
                />
            </div>

            <div className="flex gap-2">
                <FilterDropdown 
                    label="Category" 
                    value={category} 
                    onChange={setCategory} 
                    options={["ALL", ...Object.values(PostCategory)]} 
                />
                <FilterDropdown 
                    label="Type" 
                    value={type} 
                    onChange={setType} 
                    options={["ALL", ...Object.values(PostType)]} 
                />
                <FilterDropdown 
                    label="Sort" 
                    value={sortBy} 
                    onChange={setSortBy} 
                    options={["createdAt", "likesCount"]} 
                    labels={{ "createdAt": "Newest First", "likesCount": "Most Liked" }}
                />
            </div>
        </div>
    );
}

function FilterDropdown({ label, value, onChange, options, labels }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    options: string[],
    labels?: Record<string, string>
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-14 px-6 rounded-2xl border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-xl font-black text-xs uppercase tracking-widest gap-2 hover:bg-primary/10 transition-all">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline text-muted-foreground font-bold">{label}:</span>
                    <span>{labels?.[value] || value.replace("_", " ")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-2xl p-2 border-border shadow-2xl">
                <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground p-3">Filter by {label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
                    {options.map((opt) => (
                        <DropdownMenuRadioItem 
                            key={opt} 
                            value={opt}
                            className="rounded-xl px-4 py-3 font-bold text-sm cursor-pointer focus:bg-primary/10 focus:text-primary"
                        >
                            {labels?.[opt] || opt.replace("_", " ")}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
