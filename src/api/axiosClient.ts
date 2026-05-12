import axios from 'axios';

// 1. Initialize axios instance
const axiosClient = axios.create({
    // Vite uses import.meta.env instead of process.env
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor: Automatically add Token to each request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token'); // Or retrieve from Redux/Cookies
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Handle response data or global errors
axiosClient.interceptors.response.use(
    (response) => {
        // Return data directly instead of the full axios response object
        return response.data;
    },
    (error) => {
        // Handle token expiration or unauthorized access (401, 403)
        if (error.response && error.response.status === 401) {
            console.error("Token expired or invalid. Redirecting...");
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
