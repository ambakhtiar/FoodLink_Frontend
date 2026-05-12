"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProfileGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isHydrated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated && isAuthenticated) {
            // If profile is incomplete and not already on the setup page, force redirect
            if (user?.status === 'INCOMPLETE_PROFILE' && pathname !== '/auth/complete-profile') {
                router.replace('/auth/complete-profile');
            }
            // If profile is complete but user tries to go to complete-profile, redirect to home
            if (user?.status !== 'INCOMPLETE_PROFILE' && pathname === '/auth/complete-profile') {
                router.replace('/');
            }
        }
    }, [isHydrated, isAuthenticated, user, pathname, router]);

    return <>{children}</>;
}
