import { apiClient as axiosInstance } from "@/lib/axios";
import { IPost } from "@/types/post";

export interface IComment {
    id: string;
    content: string;
    userId: string;
    parentId?: string;
    createdAt: string;
    user: {
        userProfile?: { name: string };
        organizationProfile?: { orgName: string };
    };
    replies?: IComment[];
}

const createPost = async (formData: FormData): Promise<{ success: boolean; data: IPost }> => {
    const response = await axiosInstance.post("/post/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

const getPostById = async (id: string): Promise<{ success: boolean; data: IPost }> => {
    const response = await axiosInstance.get(`/post/${id}`);
    return response.data;
};

const getAllPosts = async (params: {
    searchTerm?: string;
    category?: string;
    type?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}): Promise<{ success: boolean; data: IPost[]; meta: any }> => {
    const response = await axiosInstance.get("/post", { params });
    return response.data;
};

const toggleLike = async (id: string) => {
    const response = await axiosInstance.post(`/post/${id}/like`);
    return response.data;
};

const addComment = async (postId: string, content: string, parentId?: string) => {
    const response = await axiosInstance.post(`/post/${postId}/comment`, {
        content,
        parentId,
    });
    return response.data;
};

const getComments = async (postId: string) => {
    const response = await axiosInstance.get(`/post/${postId}/comments`);
    return response.data;
};

export const postService = {
    createPost,
    getPostById,
    getAllPosts,
    toggleLike,
    addComment,
    getComments,
};
