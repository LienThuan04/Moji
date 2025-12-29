import axios from 'axios';
import { store } from '@/redux/store';
import { toast } from 'sonner';
import { setAccessToken } from '@/redux/slice/accountSlide';
import { authService } from '@/services/authService';

const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:8080/api/v1' : '/api/v1';
const NO_RETRY_HEADER = 'x-no-retry';

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Include cookies in requests
    timeout: 10000, // 10 seconds timeout
    headers: { 'Content-Type': 'application/json' }, // Default headers
}); 

const handleRefreshToken = async (): Promise<string | null> => {
    try {
        const res = await authService.refreshToken();
        if (res && res?.data && res?.data?.access_token) {
            return res.data.access_token;
        } else {
            toast.error('Session expired, please log in again.');
            return null;
        }
    } catch (error: any) {
        console.error('Failed to refresh token:', error.message);
        return null;
    }
};

api.interceptors.request.use(
    function (config) {
        try {
            const state: { account: { accessToken: string | null } } = store.getState();
            const AccessToken = state?.account?.accessToken;
            if (AccessToken) {
                config.headers = config.headers || {};
                (config.headers as any).Authorization = `Bearer ${AccessToken}`;
            }
            if (!config.headers || !(config.headers as any)['Content-Type']) {
                config.headers = config.headers || {};
                (config.headers as any)['Content-Type'] = 'application/json';
            }
        } catch (err) {
            // ignore - ensure request still proceeds
            console.error('Failed to attach access token to request', err);
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    async (error) => {
        if (error.config && error.response
            && +error.response.status === 401 // Unauthorized
            && error.config.url !== '/api/v1/auth/login' // loại trừ request login
            && !error.config.headers[NO_RETRY_HEADER] // kiểm tra đã retry chưa
        ) {
            const Dispatch = store.dispatch; // Lấy dispatch từ store
            const access_token = await handleRefreshToken(); // Thử làm mới token
            error.config.headers[NO_RETRY_HEADER] = 'true' // Đánh dấu đã retry
            if (access_token) { // Nếu làm mới token thành công, retry request ban đầu
                error.config.headers['Authorization'] = `Bearer ${access_token}`; // Cập nhật header với token mới
                Dispatch(setAccessToken(access_token));
                return api.request(error.config); // Retry original request
            }
        }
        return Promise.reject(error);
    }
);
/**
 * Replaces main `axios` instance with the custom-one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
// const axios = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);

// export default axios;
export default api;