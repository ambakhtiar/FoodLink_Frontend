"use client";

import { useAuthStore, type User, type AccountStatus } from "@/store/authStore";

interface UseAuthReturn {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    status: AccountStatus | null;
    isHydrated: boolean;
    setAuth: (user: User, token: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export function useAuth(): UseAuthReturn {
    const store = useAuthStore();

    return {
        user: store.user,
        token: store.token,
        isAuthenticated: store.isAuthenticated,
        status: store.status,
        isHydrated: store.isHydrated,
        setAuth: store.setAuth,
        updateUser: store.updateUser,
        logout: store.logout,
    };
}
