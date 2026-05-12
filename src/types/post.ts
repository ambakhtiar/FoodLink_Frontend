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
    status: 'AVAILABLE' | 'PENDING' | 'COMPLETED' | 'EXPIRED';
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    isLikedByMe?: boolean;
    author: {
        userProfile?: { name: string };
        organizationProfile?: { orgName: string };
    };
}
