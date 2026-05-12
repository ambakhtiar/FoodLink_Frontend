import axiosInstance from "@/lib/axiosInstance";

export interface IPost {
    id: string;
    title: string;
    description: string;
    imageUrls: string[];
    likesCount: number;
    commentsCount: number;
    isLikedByMe?: boolean;
    author: {
        userProfile?: { name: string };
        organizationProfile?: { orgName: string };
    };
    likes?: any[];
}

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

const createPost = async (formData: FormData) => {
    const response = await axiosInstance.post("/post/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

const getPostById = async (id: string) => {
    const response = await axiosInstance.get(`/post/${id}`);
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
    toggleLike,
    addComment,
    getComments,
};
