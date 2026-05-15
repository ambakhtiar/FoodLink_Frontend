"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];

interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const router = useRouter();

    const isAdmin = Boolean(user?.role && (ADMIN_ROLES as readonly string[]).includes(user.role));

    useEffect(() => {
        if (!isHydrated) return;
        if (!isAuthenticated) {
            router.replace("/auth/login");
            return;
        }
        if (!isAdmin) {
            router.replace("/");
        }
    }, [isHydrated, isAuthenticated, isAdmin, router]);

    // Hydrating — show fullscreen skeleton
    if (!isHydrated) {
        return <AdminLoadingSkeleton />;
    }

    // Redirecting — render nothing
    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return <>{children}</>;
}

function AdminLoadingSkeleton() {
    return (
        <div className="flex h-screen w-full bg-background">
            {/* Sidebar skeleton */}
            <div className="hidden md:flex flex-col w-60 border-r border-border bg-card/50 p-4 gap-4 animate-pulse flex-shrink-0">
                {/* Brand */}
                <div className="h-10 w-36 rounded-lg bg-muted mb-4" />
                {/* Nav links */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-9 w-full rounded-lg bg-muted" />
                ))}
                {/* Bottom user */}
                <div className="mt-auto flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 rounded bg-muted" />
                        <div className="h-3 w-16 rounded bg-muted" />
                    </div>
                </div>
            </div>
            {/* Content skeleton */}
            <div className="flex-1 flex flex-col p-6 gap-6 animate-pulse overflow-hidden">
                <div className="h-8 w-48 rounded-lg bg-muted" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-muted" />
                    ))}
                </div>
                <div className="flex-1 rounded-2xl bg-muted" />
            </div>
        </div>
    );
}
