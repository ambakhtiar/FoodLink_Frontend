"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = ({ children, value, onValueChange }: any) => {
    return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { value, onValueChange });
        }
        return child;
    });
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(
    ({ className, children, value, onValueChange, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        );
    }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, value }: any) => {
    return <span>{value || placeholder}</span>;
};

const SelectContent = ({ children, value, onValueChange, className }: any) => {
    // This is a very simplified version that just renders a hidden native select for functionality
    // and a styled div for appearance. In a real shadcn setup, this would be a Popover.
    // For now, we'll just use a native select to ensure functionality and fix the build.
    return (
        <div className={cn("relative", className)}>
            <select
                value={value}
                onChange={(e) => onValueChange?.(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && (child.type as any) === SelectItem) {
                        const itemProps = child.props as any;
                        return <option value={itemProps.value}>{itemProps.children}</option>;
                    }
                    return null;
                })}
            </select>
        </div>
    );
};

const SelectItem = ({ children, value }: any) => {
    return null; // The logic is handled in SelectContent's select > option
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
