export enum EquipmentStatus {
    AVAILABLE = 'AVAILABLE',
    IN_USE = 'IN_USE',
    MAINTENANCE = 'MAINTENANCE',
    BROKEN = 'BROKEN'
}

export interface Equipment {
    id: number;
    name: string;
    inventoryNumber: string;
    status: EquipmentStatus;
    documentationLink?: string;
    description?: string;
    labId: number;
    labName: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface EquipmentCreateRequest {
    name: string;
    inventoryNumber: string;
    status: EquipmentStatus;
    labId: number;
}

export interface EquipmentUpdateRequest {
    name: string;
    inventoryNumber: string;
    status: EquipmentStatus;
    labId: number;
}
