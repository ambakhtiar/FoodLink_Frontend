"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService, CreateAdminPayload, CreatedAdminResponse } from "@/services/adminService";

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            adminService.updateUserStatus(userId, status),
        onSuccess: (data) => {
            toast.success(data.message || "User status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Failed to update user status";
            toast.error(message);
        },
    });
}

export function useUpdateOrgStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orgId, status }: { orgId: string; status: string }) =>
            adminService.updateOrgStatus(orgId, status),
        onSuccess: (data) => {
            toast.success(data.message || "Organization status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Failed to update organization status";
            toast.error(message);
        },
    });
}

export function useUpdatePostStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, status }: { postId: string; status: string }) =>
            adminService.updatePostStatus(postId, status),
        onSuccess: (data) => {
            toast.success(data.message || "Post status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Failed to update post status";
            toast.error(message);
        },
    });
}

export function useDeletePostMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => adminService.deletePost(postId),
        onSuccess: (data) => {
            toast.success(data.message || "Post deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Failed to delete post";
            toast.error(message);
        },
    });
}

export function useCreateAdmin(onCreated?: (data: CreatedAdminResponse) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateAdminPayload) => adminService.createAdmin(payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
            onCreated?.(response.data);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Failed to create admin";
            toast.error(message);
        },
    });
}
