"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isHydrated) return;
        if (!isAuthenticated) {
            router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isHydrated, router, pathname]);

    // While store is rehydrating from localStorage, show loading
    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative h-10 w-10">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // redirect in progress
    }

    return <>{children}</>;
}
