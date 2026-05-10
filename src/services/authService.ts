import { apiClient } from "@/lib/axios";
import { useAuthStore, type User } from "@/store/authStore";
import type {
    LoginInput,
    RegisterInput,
    GoogleLoginInput,
} from "@/lib/validations/auth";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authService = {
    async loginUser(credentials: LoginInput): Promise<AuthResponse> {
        const { data: response } = await apiClient.post<ApiResponse<{ accessToken: string }>>("/auth/login", credentials);

        // After getting token, set it temporarily to fetch profile
        useAuthStore.getState().setAuth({} as User, response.data.accessToken);

        // Fetch user profile
        const { data: profileResponse } = await apiClient.get<ApiResponse<User>>("/auth/me");

        return {
            user: profileResponse.data,
            token: response.data.accessToken
        };
    },

    async registerUser(data: RegisterInput): Promise<{ message: string }> {
        const { data: response } = await apiClient.post<ApiResponse<any>>("/auth/register", data);
        return { message: response.message };
    },

    async googleLogin(data: GoogleLoginInput): Promise<AuthResponse> {
        const { data: response } = await apiClient.post<ApiResponse<{ accessToken: string }>>("/auth/google", data);

        useAuthStore.getState().setAuth({} as User, response.data.accessToken);
        const { data: profileResponse } = await apiClient.get<ApiResponse<User>>("/auth/me");

        return {
            user: profileResponse.data,
            token: response.data.accessToken
        };
    },

    async getProfile(): Promise<User> {
        const { data: response } = await apiClient.get<ApiResponse<User>>("/auth/me");
        return response.data;
    },

    async forgotPassword(email: string): Promise<{ message: string }> {
        const { data: response } = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", { email });
        return { message: response.message };
    },

    async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
        const { data: response } = await apiClient.post<ApiResponse<null>>("/auth/verify-otp", { email, otp });
        return { message: response.message };
    },

    async resetPassword(data: any): Promise<{ message: string }> {
        const { data: response } = await apiClient.post<ApiResponse<null>>("/auth/reset-password", data);
        return { message: response.message };
    },
};
