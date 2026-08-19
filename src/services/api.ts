import axios from 'axios';

const api = axios.create({
    // Vercel UI will use the Live Render Backend. Local devs can optionally override this.
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://exfinanz-backend.onrender.com/api',
});

// Interceptor to attach auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
