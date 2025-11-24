import type { Equipment } from './Equipment';

export const LabWorkStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED'
} as const;

export type LabWorkStatus = typeof LabWorkStatus[keyof typeof LabWorkStatus];

export interface LabWork {
    id: number;
    title: string;
    description?: string;
    authorUsername: string;
    requiredEquipment: Equipment[];
    status: LabWorkStatus;
    createdAt: string;
    updatedAt: string;
}

export interface LabWorkCreateRequest {
    title: string;
    description?: string;
    equipmentIds: number[];
}

export interface LabWorkUpdateRequest {
    title?: string;
    description?: string;
    equipmentIds?: number[];
    status?: LabWorkStatus;
}
