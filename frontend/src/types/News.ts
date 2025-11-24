export const NewsType = {
    NEW_EQUIPMENT: 'NEW_EQUIPMENT',
    NEW_PROJECT: 'NEW_PROJECT',
    ANNOUNCEMENT: 'ANNOUNCEMENT',
    SYSTEM: 'SYSTEM',
    UPDATE: 'UPDATE',
    EVENT: 'EVENT',
    OTHER: 'OTHER'
} as const;

export type NewsType = typeof NewsType[keyof typeof NewsType];

export interface News {
    id: number;
    type: NewsType;
    title: string;
    content: string;
    imageUrl?: string;
    priority: number;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NewsCreateRequest {
    type: NewsType;
    title: string;
    content: string;
    imageUrl?: string;
    priority?: number;
}
