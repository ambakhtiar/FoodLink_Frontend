import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AccountStatus = "active" | "suspended" | "pending" | "inactive" | "INCOMPLETE_PROFILE";

export interface User {
    id: string;
    email: string;
    name: string;
    role: "USER" | "ORGANIZATION" | "ADMIN";
    status?: AccountStatus;
    profilePictureUrl?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    authProvider?: string;
    profile?: {
        orgName?: string;
        establishedYear?: number;
        registrationNumber?: string;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    status: AccountStatus | null;
    isHydrated: boolean;
    setAuth: (user: User, token: string) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
    setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            status: null,
            isHydrated: false,
            setAuth: (user, token) => {
                // Write a lightweight cookie so the server-side proxy can detect auth
                if (typeof document !== "undefined") {
                    document.cookie = `fl_auth=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
                }
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    status: user.status || "active",
                });
            },
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                    status: userData.status || state.status,
                })),
            logout: () => {
                // Clear the auth cookie
                if (typeof document !== "undefined") {
                    document.cookie = "fl_auth=; path=/; max-age=0; SameSite=Lax";
                }
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    status: null,
                });
            },
            setHydrated: (hydrated) => set({ isHydrated: hydrated }),
        }),
        {
            name: "helpshare-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                status: state.status,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);
