import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AccountStatus = "active" | "suspended" | "pending" | "inactive";

export interface User {
    id: string;
    email: string;
    name: string;
    role: "donor" | "receiver" | "admin";
    status?: AccountStatus;
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
            isHydrated: false,
            setAuth: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    status: user.status || "active",
                }),
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                    status: userData.status || state.status,
                })),
            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    status: null,
                }),
            setHydrated: (hydrated) => set({ isHydrated: hydrated }),
        }),
        {
            name: "foodlink-auth",
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
