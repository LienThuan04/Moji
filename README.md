# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# `Documentation this project`:

### Dowload package for Frontend init:
- dependencies
```bash
npm i react-router axios lucide-react tailwindcss @tailwindcss/vite tailwindcss-animate zustand zod react-hook-form @hookform/resolvers sonner
```

<!-- - devDependencies
```bash
npm i -D 
``` -->
### `Tailwindcss` [Document](https://tailwindcss.com/docs/installation/using-vite)
### `Sonner` [Document](https://sonner.emilkowal.ski/getting-started)
### `ShadCN UI` [Document](https://ui.shadcn.com/docs/installation/vite)
### `Patterncraft Theme` [Document](https://patterncraft.fun/)
### `Zod` [Document](https://zod.dev/api)
### `Hookform` [Document](https://www.react-hook-form.com/get-started/#Applyvalidation)
### `Use Redux` [Document](https://react-redux.js.org/tutorials/quick-start)
### `SetUp Axios`:
```bash
// Instance axios dùng chung cho toàn app để gửi các request HTTP
import axios from 'axios';
// Truy cập store redux trực tiếp từ module này (không thể dùng React hooks)
import { store } from '@/redux/store';
// Thông báo toast cho các lỗi hiển thị đến người dùng
import { toast } from 'sonner';
// Action để cập nhật access token vào redux sau khi thực hiện refresh
import { setAccessToken } from '@/redux/slice/accountSlide';
// Các hàm API liên quan authentication (refresh, logout, ...)
import { authService } from '@/services/authService';

const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:8080/api/v1' : '/api/v1';
// Khóa header dùng để đánh dấu request đã được retry.
// Ta gắn cờ này vào `config.headers` của request gốc để tránh vòng lặp
// refresh/retry vô hạn nếu request sau khi retry vẫn trả về 401.
const NO_RETRY_HEADER = 'x-no-retry';

// Tạo một instance axios dùng chung với cấu hình mặc định.
// - `withCredentials: true` cho phép gửi cookie (refresh token) kèm theo request.
// - `baseURL` trỏ đến endpoint API backend (tùy môi trường dev/prod).
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Gửi cookie (cần để refresh token hoạt động)
    timeout: 10000, // Timeout mặc định 10 giây
    headers: { 'Content-Type': 'application/json' }, // Kiểu nội dung mặc định
}); 


/**
 * Thử làm mới access token bằng cách gọi endpoint refresh trên backend.
 * - Dùng refresh-token (cookie) để backend trả về access token mới.
 * - Trả về chuỗi access token khi thành công, hoặc `null` khi thất bại.
 */
const handleRefreshToken = async (): Promise<string | null> => {
    try {
        const res = await authService.refreshToken();
        // Backend kỳ vọng trả về { data: { access_token: '...' } }
        if (res && res?.data && res?.data?.access_token) {
            return res.data.access_token;
        } else {
            // Nếu refresh không trả token, thông báo và yêu cầu đăng nhập lại
            toast.error('Phiên đã hết hạn, vui lòng đăng nhập lại.');
            return null;
        }
    } catch (error: any) {
        // Lỗi mạng hoặc server khi refresh
        console.error('Không thể refresh token:', error?.message ?? error);
        return null;
    }
};

// Interceptor trước khi gửi request: gán header Authorization nếu có access token
// Lưu ý: không dùng hook ở đây nên đọc trực tiếp từ `store.getState()`.
api.interceptors.request.use(
    function (config) {
        try {
            const state: { account: { accessToken: string | null } } = store.getState();
            const AccessToken = state?.account?.accessToken;
            if (AccessToken) {
                config.headers = config.headers || {};
                (config.headers as any).Authorization = `Bearer ${AccessToken}`;
            }
            // Đảm bảo luôn có Content-Type nếu cần
            if (!config.headers || !(config.headers as any)['Content-Type']) {
                config.headers = config.headers || {};
                (config.headers as any)['Content-Type'] = 'application/json';
            }
        } catch (err) {
            // Nếu không đọc được store, vẫn cho phép request tiếp tục (không có Authorization)
            console.error('Không thể gắn access token vào request', err);
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Interceptor phản hồi: nếu nhận 401 Unauthorized thì cố gắng refresh token
// Luồng xử lý:
// 1) Nếu response là 401 và request chưa được retry, gọi `handleRefreshToken()`
//    để lấy access token mới (backend dùng refresh cookie).
// 2) Gắn cờ `NO_RETRY_HEADER` vào config để tránh retry lặp vô hạn.
// 3) Nếu refresh thành công, cập nhật header Authorization, dispatch `setAccessToken`
//    để lưu token mới vào redux, rồi retry request gốc.
// 4) Nếu refresh thất bại, trả về reject (caller sẽ xử lý logout hoặc điều hướng).
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        try {
            if (
                error?.config &&
                error?.response &&
                +error.response.status === 401 &&
                !(error.config.url || '').includes('/auth/login') &&
                !(error.config.headers && error.config.headers[NO_RETRY_HEADER])
            ) {
                const Dispatch = store.dispatch;

                // Thử lấy token mới từ backend
                const access_token = await handleRefreshToken();

                // Đánh dấu request đã retry
                error.config.headers = error.config.headers || {};
                error.config.headers[NO_RETRY_HEADER] = 'true';

                if (access_token) {
                    // Gắn token mới lên request gốc và cập nhật redux
                    error.config.headers['Authorization'] = `Bearer ${access_token}`;
                    Dispatch(setAccessToken(access_token));
                    return api.request(error.config);
                }
            }
        } catch (err) {
            console.error('Lỗi trong response interceptor:', err);
        }

        // Không phải trường hợp xử lý hoặc refresh thất bại
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
```
