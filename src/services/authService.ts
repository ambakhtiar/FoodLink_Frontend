import { apiClient } from "@/lib/axios";
import type { User } from "@/store/authStore";
import type {
    LoginInput,
    RegisterInput,
    GoogleLoginInput,
} from "@/lib/validations/auth";

export interface AuthResponse {
    user: User;
    token: string;
}

export const authService = {
    async loginUser(credentials: LoginInput): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
        return data;
    },

    async registerUser(data: RegisterInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/register", data);
        return response.data;
    },

    async googleLogin(data: GoogleLoginInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/google", data);
        return response.data;
    },

    async getProfile(): Promise<User> {
        const { data } = await apiClient.get<User>("/auth/me");
        return data;
    },
};
