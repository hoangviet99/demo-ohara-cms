import axios from 'axios';

// 1. Khởi tạo instance
const axiosClient = axios.create({
    // Vite sử dụng import.meta.env thay vì process.env
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Request Interceptor: Tự động thêm Token vào mỗi Request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token'); // Hoặc lấy từ Redux/Cookies
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Xử lý kết quả trả về hoặc lỗi chung
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về dữ liệu trực tiếp thay vì bọc trong đối tượng axios
        return response.data;
    },
    (error) => {
        // Xử lý khi Token hết hạn hoặc không có quyền (401, 403)
        if (error.response && error.response.status === 401) {
            console.error("Token hết hạn hoặc không hợp lệ. Đang chuyển hướng...");
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
