import axios from 'axios';

const api = axios.create({
    // Hardcoded for Vercel deployment stability
    baseURL: 'https://exfinanz-backend.onrender.com/api',
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
