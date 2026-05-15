"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService, GetUsersParams, GetOrgsParams, GetPostsParams, GetAdminsParams } from "@/services/adminService";

export function useAdminUsers(params: GetUsersParams) {
    return useQuery({
        queryKey: ["admin-users", params],
        queryFn: () => adminService.getUsers(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminOrganizations(params: GetOrgsParams) {
    return useQuery({
        queryKey: ["admin-organizations", params],
        queryFn: () => adminService.getOrganizations(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminPosts(params: GetPostsParams) {
    return useQuery({
        queryKey: ["admin-posts", params],
        queryFn: () => adminService.getPosts(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminAdmins(params: GetAdminsParams) {
    return useQuery({
        queryKey: ["admin-admins", params],
        queryFn: () => adminService.getAdmins(params),
        placeholderData: (previousData) => previousData,
    });
}
