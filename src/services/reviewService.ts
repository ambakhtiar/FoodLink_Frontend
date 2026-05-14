import { apiClient } from "@/lib/axios";
import { CreateReviewPayload } from "./transactionService";

export interface ReviewResponse {
    id: string;
    reviewerId: string;
    revieweeId: string;
    transactionId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
}

const createReview = async (payload: CreateReviewPayload): Promise<{ data: ReviewResponse }> => {
    const response = await apiClient.post('/review/create', payload);
    return response.data;
};

export const reviewService = {
    createReview,
};
