// src/types/Lab.ts
export interface Lab {
    id: number;
    name: string;
    location: string;
    capacity: number;
    description?: string;
}

export interface LabCreateRequest {
    name: string;
    location: string;
    capacity: number;
    description?: string;
}
