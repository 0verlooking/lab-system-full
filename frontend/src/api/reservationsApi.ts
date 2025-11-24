import http from './http';
import type { Reservation, ReservationCreateRequest, ReservationStatus } from '../types/Reservation';

export const reservationsApi = {
    getAll: async (): Promise<Reservation[]> => {
        const res = await http.get<Reservation[]>('/reservations');
        return res.data;
    },

    getMy: async (): Promise<Reservation[]> => {
        const res = await http.get<Reservation[]>('/reservations/me');
        return res.data;
    },

    getPending: async (): Promise<Reservation[]> => {
        const res = await http.get<Reservation[]>('/reservations/pending');
        return res.data;
    },

    create: async (payload: ReservationCreateRequest): Promise<Reservation> => {
        const res = await http.post<Reservation>('/reservations', payload);
        return res.data;
    },

    approve: async (id: number): Promise<Reservation> => {
        const res = await http.post<Reservation>(`/reservations/${id}/approve`);
        return res.data;
    },

    reject: async (id: number): Promise<Reservation> => {
        const res = await http.post<Reservation>(`/reservations/${id}/reject`);
        return res.data;
    },

    updateStatus: async (id: number, reservationId: number, status: ReservationStatus): Promise<Reservation> => {
        const res = await http.patch<Reservation>(`/reservations/${id}/status`, { reservationId, status });
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await http.delete(`/reservations/${id}`);
    },
};
