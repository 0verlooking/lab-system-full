import http from './http';
import type { LabWork, LabWorkCreateRequest, LabWorkUpdateRequest } from '../types/LabWork';

export const labWorksApi = {
    getAll: async (): Promise<LabWork[]> => {
        const res = await http.get<LabWork[]>('/labworks');
        return res.data;
    },

    getById: async (id: number): Promise<LabWork> => {
        const res = await http.get<LabWork>(`/labworks/${id}`);
        return res.data;
    },

    getPublished: async (): Promise<LabWork[]> => {
        const res = await http.get<LabWork[]>('/labworks/published');
        return res.data;
    },

    getMy: async (): Promise<LabWork[]> => {
        const res = await http.get<LabWork[]>('/labworks/my');
        return res.data;
    },

    create: async (labWork: LabWorkCreateRequest): Promise<LabWork> => {
        const res = await http.post<LabWork>('/labworks', labWork);
        return res.data;
    },

    update: async (id: number, labWork: LabWorkUpdateRequest): Promise<LabWork> => {
        const res = await http.put<LabWork>(`/labworks/${id}`, labWork);
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await http.delete(`/labworks/${id}`);
    },
};
