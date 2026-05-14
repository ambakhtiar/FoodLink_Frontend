import { apiClient } from "@/lib/axios";

export interface RequestItemPayload {
    postId: string;
    quantity: string;
    deliveryNote?: string;
}

export interface RespondTransactionPayload {
    transactionId: string;
    status: 'APPROVED' | 'REJECTED';
}

export interface CreateReviewPayload {
    transactionId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
}

export interface TransactionResponse {
    id: string;
    postId: string;
    actorId: string;
    quantity: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    message: string | null;
    createdAt: string;
}

const requestItem = async (payload: RequestItemPayload): Promise<{ data: TransactionResponse }> => {
    const response = await apiClient.post('/transaction/request', payload);
    return response.data;
};

const respondToRequest = async ({ transactionId, status }: RespondTransactionPayload): Promise<{ data: TransactionResponse }> => {
    const response = await apiClient.patch(`/transaction/${transactionId}/respond`, { status });
    return response.data;
};

const completeTransaction = async (transactionId: string): Promise<{ data: TransactionResponse }> => {
    const response = await apiClient.patch(`/transaction/${transactionId}/complete`);
    return response.data;
};

const getMyRequests = async (params: {
    page?: number;
    limit?: number;
}): Promise<{ success: boolean; data: (TransactionResponse & { post: any })[]; meta: any }> => {
    const response = await apiClient.get('/transaction/my-requests', { params });
    return response.data;
};

export const transactionService = {
    requestItem,
    respondToRequest,
    completeTransaction,
    getMyRequests,
};
