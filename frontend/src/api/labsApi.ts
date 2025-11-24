import http from './http';
import type { Lab, LabCreateRequest } from '../types/Lab';

export const labsApi = {
    getAll: async (): Promise<Lab[]> => {
        const res = await http.get<Lab[]>('/labs');
        return res.data;
    },

    getById: async (id: number): Promise<Lab> => {
        const res = await http.get<Lab>(`/labs/${id}`);
        return res.data;
    },

    create: async (lab: LabCreateRequest): Promise<Lab> => {
        const res = await http.post<Lab>('/labs', lab);
        return res.data;
    },

    update: async (id: number, lab: LabCreateRequest): Promise<Lab> => {
        const res = await http.put<Lab>(`/labs/${id}`, lab);
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await http.delete(`/labs/${id}`);
    },
};
