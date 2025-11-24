import http from './http';
import type { News, NewsCreateRequest } from '../types/News';

export const newsApi = {
    getActive: async (): Promise<News[]> => {
        const res = await http.get<News[]>('news');
        return res.data;
    },

    getAll: async (): Promise<News[]> => {
        const res = await http.get<News[]>('news/all');
        return res.data;
    },

    create: async (news: NewsCreateRequest): Promise<News> => {
        const res = await http.post<News>('news', news);
        return res.data;
    },

    publish: async (id: number): Promise<News> => {
        const res = await http.post<News>(`news/${id}/publish`);
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await http.delete(`news/${id}`);
    }
};
