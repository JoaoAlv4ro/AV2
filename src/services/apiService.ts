import axios, { AxiosError, type AxiosInstance } from 'axios';

export const BASE_URL = 
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

api.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
        const status = error.response?.status;
        const msg =
            (error.response?.data as { error?: string })?.error ||
            error.message || `HTTP ${status ?? 'ERR'}`;
        return Promise.reject(new Error(msg));
    }
);

export const http = {
    get: async <T>(url: string, params?:  Record<string, unknown>) => {
        const res = await api.get<T>(url, { params });
        return res.data;
    },
    post: async <T>(url: string, body?: unknown) => {
        const res = await api.post<T>(url, body);
        return res.data;
    },
    put: async <T>(url: string, body?: unknown) => {
        const res = await api.put<T>(url, body);
        return res.data;
    },
    delete: async <T>(url: string) => {
        const res = await api.delete<T>(url);
        return res.data;
    },
}

export default api;
