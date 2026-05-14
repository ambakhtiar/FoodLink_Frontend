export enum PostType {
    DONATION = 'DONATION',
    REQUEST = 'REQUEST',
}

export enum PostCategory {
    COOKED_FOOD = 'COOKED_FOOD',
    DRY_FOOD = 'DRY_FOOD',
    CLOTHING = 'CLOTHING',
    FURNITURE = 'FURNITURE',
    ELECTRONICS = 'ELECTRONICS',
    MEDICAL_SUPPLIES = 'MEDICAL_SUPPLIES',
    OTHERS = 'OTHERS',
}

export interface ITransactionReview {
    reviewerId: string;
}

export interface ITransactionActor {
    id: string;
    profilePictureUrl?: string | null;
    userProfile?: { name: string; impactScore?: number } | null;
    organizationProfile?: { orgName: string; impactScore?: number } | null;
}

export interface ITransactionRequest {
    id: string;
    postId: string;
    actorId: string;
    quantity: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    message: string | null;
    createdAt: string;
    actor?: ITransactionActor;
    reviews?: ITransactionReview[];
}

export interface IPost {
    id: string;
    authorId: string;
    type: PostType;
    category: PostCategory;
    title: string;
    description: string;
    imageUrls: string[];
    quantity: number;
    latitude: number;
    longitude: number;
    status: 'AVAILABLE' | 'PENDING_HANDOVER' | 'COMPLETED' | 'EXPIRED';
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    estimatedShelfLife?: string;
    isLikedByMe?: boolean;
    transactionRequests?: ITransactionRequest[];
    author: {
        id: string;
        profilePictureUrl?: string | null;
        userProfile?: { name: string; impactScore?: number } | null;
        organizationProfile?: { orgName: string; impactScore?: number } | null;
    };
}
