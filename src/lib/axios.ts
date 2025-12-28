import axios from 'axios';

const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:8080/api/v1' : '/api/v1';

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Include cookies in requests
    timeout: 10000, // 10 seconds timeout
    headers: { 'Content-Type': 'application/json' }, // Default headers
}); 
export default api;

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);
