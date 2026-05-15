"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
    label: string;
    value: string;
}

interface DataTableFilterProps {
    options: FilterOption[];
    paramKey: string;
    placeholder?: string;
}

const CLEAR_VALUE = "__all__";

export function DataTableFilter({
    options,
    paramKey,
    placeholder = "Filter...",
}: DataTableFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentValue = searchParams.get(paramKey) ?? CLEAR_VALUE;

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === CLEAR_VALUE) {
            params.delete(paramKey);
        } else {
            params.set(paramKey, value);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger className="h-10 rounded-xl bg-card border-border min-w-[140px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={CLEAR_VALUE}>{placeholder}</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
