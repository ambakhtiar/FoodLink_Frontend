"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export interface SortOption {
    label: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

interface DataTableSortProps {
    options: SortOption[];
    placeholder?: string;
}

// Encode a SortOption into a single string value for the Select
function encode(opt: SortOption): string {
    return `${opt.sortBy}__${opt.sortOrder}`;
}

const CLEAR_VALUE = "__none__";

export function DataTableSort({ options, placeholder = "Sort by..." }: DataTableSortProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder");
    const currentValue =
        currentSortBy && currentSortOrder
            ? `${currentSortBy}__${currentSortOrder}`
            : CLEAR_VALUE;

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === CLEAR_VALUE) {
            params.delete("sortBy");
            params.delete("sortOrder");
        } else {
            const [sortBy, sortOrder] = value.split("__");
            params.set("sortBy", sortBy);
            params.set("sortOrder", sortOrder);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger className="h-10 rounded-xl bg-card border-border min-w-[150px] gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={CLEAR_VALUE}>{placeholder}</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={encode(opt)} value={encode(opt)}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
