import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import config from "../configs/config";

export const apiClient = axios.create({
    baseURL: `${config.publicAPI}`,
    timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // อย่าแนบ token ใน public routes
        const publicRoutes = ["/auth/login", "/auth/register", "/auth/refresh"];
        if (publicRoutes.some(route => config.url?.includes(route))) {
            return config;
        }

        // แนบ token ใน protected routes
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { 
            _retry?: boolean 
        };

        // Auto-refresh เมื่อได้ 401 (ไม่ใช่ refresh endpoint)
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh") &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/register")
        ) {
            originalRequest._retry = true;
            console.log("🔄 Access token expired, trying to refresh...");

            try {
                const refresh_token = localStorage.getItem("refresh_token");
                if (!refresh_token) {
                    throw new Error("No refresh token available");
                }

                // ใช้ axios instance แยกเพื่อไม่โดน interceptor
                const refreshClient = axios.create({
                    baseURL: config.publicAPI,
                    timeout: 10000,
                });

                const res = await refreshClient.post("/auth/refresh", { refresh_token });

                const { access_token, refresh_token: newRefreshToken } = res.data;
                
                // บันทึก tokens ใหม่
                localStorage.setItem("access_token", access_token);
                if (newRefreshToken) {
                    localStorage.setItem("refresh_token", newRefreshToken);
                }

                console.log("✅ Token refreshed successfully");

                // Retry request เดิมด้วย token ใหม่
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error("❌ Failed to refresh token:", refreshError);
                
                // Clear tokens และ redirect
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);