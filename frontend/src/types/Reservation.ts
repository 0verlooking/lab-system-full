import type { Equipment } from './Equipment';

export const ReservationStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED'
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

export interface Reservation {
    id: number;
    labId: number;
    labName: string;
    userId: number;
    username: string;
    labWorkId?: number;
    labWorkTitle?: string;
    equipment: Equipment[];
    startTime: string; // ISO date-time
    endTime: string;   // ISO date-time
    status: ReservationStatus;
    purpose?: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
}

export interface ReservationCreateRequest {
    labId: number;
    labWorkId?: number;
    equipmentIds: number[];
    startTime: string;
    endTime: string;
    purpose?: string;
}

export interface ReservationStatusUpdateRequest {
    reservationId: number;
    status: ReservationStatus;
}
