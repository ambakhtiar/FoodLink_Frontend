import { apiClient } from "@/lib/axios";

export interface PaginatedMeta {
    totalCount: number;
    currentPage: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    meta: PaginatedMeta;
    data: T[];
}

export interface AdminUser {
    id: string;
    email: string;
    role: "USER" | "ORGANIZATION" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "PENDING" | "INCOMPLETE_PROFILE" | "BANNED";
    createdAt: string;
    userProfile?: { name: string; impactScore: number } | null;
    organizationProfile?: { orgName: string; impactScore: number } | null;
}

export interface AdminOrg {
    id: string;
    email: string;
    role: "ORGANIZATION";
    status: "ACTIVE" | "PENDING" | "INCOMPLETE_PROFILE" | "BANNED";
    createdAt: string;
    organizationProfile?: {
        orgName: string;
        establishedYear: number | null;
        registrationNumber: string | null;
        latitude: number;
        longitude: number;
        impactScore: number;
    } | null;
}

export interface AdminPost {
    id: string;
    title: string;
    description: string;
    imageUrls: string[];
    type: "DONATION" | "REQUEST";
    category: string;
    quantity: number;
    status: "AVAILABLE" | "PENDING_HANDOVER" | "COMPLETED" | "EXPIRED" | "SUSPENDED";
    createdAt: string;
    author: {
        id: string;
        userProfile?: { name: string } | null;
        organizationProfile?: { orgName: string } | null;
    };
}

export interface AdminAdminUser {
    id: string;
    email: string;
    phone: string | null;
    role: "ADMIN";
    status: "ACTIVE" | "PENDING" | "INCOMPLETE_PROFILE" | "BANNED";
    createdAt: string;
    adminProfile?: {
        name: string;
        department: string | null;
    } | null;
}

export interface CreatedAdminResponse {
    id: string;
    email: string;
    phone: string | null;
    role: "ADMIN";
    status: string;
    needsPasswordChange: boolean;
    defaultPassword: string;
    adminProfile?: { name: string; department: string | null } | null;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface GetOrgsParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface GetPostsParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: string;
    category?: string;
    type?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface GetAdminsParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

export interface CreateAdminPayload {
    name: string;
    email: string;
    phone: string;
    department?: string;
}

export const adminService = {
    async getUsers(params: GetUsersParams): Promise<PaginatedResponse<AdminUser>> {
        const { data } = await apiClient.get<PaginatedResponse<AdminUser>>("/admin/users", { params });
        return data;
    },

    async updateUserStatus(userId: string, status: string): Promise<{ message: string }> {
        const { data } = await apiClient.patch<{ message: string }>(`/admin/users/${userId}/status`, { status });
        return data;
    },

    async getOrganizations(params: GetOrgsParams): Promise<PaginatedResponse<AdminOrg>> {
        const { data } = await apiClient.get<PaginatedResponse<AdminOrg>>("/admin/organizations", { params });
        return data;
    },

    async updateOrgStatus(orgId: string, status: string): Promise<{ message: string }> {
        const { data } = await apiClient.patch<{ message: string }>(`/admin/organizations/${orgId}/status`, { status });
        return data;
    },

    async getPosts(params: GetPostsParams): Promise<PaginatedResponse<AdminPost>> {
        const { data } = await apiClient.get<PaginatedResponse<AdminPost>>("/admin/posts", { params });
        return data;
    },

    async updatePostStatus(postId: string, status: string): Promise<{ message: string }> {
        const { data } = await apiClient.patch<{ message: string }>(`/admin/posts/${postId}/status`, { status });
        return data;
    },

    async deletePost(postId: string): Promise<{ message: string }> {
        const { data } = await apiClient.delete<{ message: string }>(`/admin/posts/${postId}`);
        return data;
    },

    async getAdmins(params: GetAdminsParams): Promise<PaginatedResponse<AdminAdminUser>> {
        const { data } = await apiClient.get<PaginatedResponse<AdminAdminUser>>("/admin/admins", { params });
        return data;
    },

    async createAdmin(payload: CreateAdminPayload): Promise<{ message: string; data: CreatedAdminResponse }> {
        const { data } = await apiClient.post<{ message: string; data: CreatedAdminResponse }>("/admin/create", payload);
        return data;
    },
};
