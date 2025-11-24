import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
http.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error details for debugging
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config?.url,
                method: error.config?.method,
            });
        }

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_role');
            window.location.href = '/login';
        }

        // Enhance error message with backend response
        if (error.response?.data?.message) {
            error.message = error.response.data.message;
        } else if (error.response?.data?.error) {
            error.message = error.response.data.error;
        } else if (error.response?.status === 500) {
            error.message = 'Внутрішня помилка сервера. Зверніться до адміністратора.';
        } else if (error.response?.status === 404) {
            error.message = 'Ресурс не знайдено';
        } else if (error.response?.status === 403) {
            error.message = 'Доступ заборонено';
        }

        return Promise.reject(error);
    }
);

export default http;
