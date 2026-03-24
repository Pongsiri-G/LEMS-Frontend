import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import config from "../configs/config";
import { store } from "../store";
import { jwtDecode } from "jwt-decode";
import { logout, setCredentials } from "../feature/authSlice";

export const apiClient = axios.create({
    baseURL: config.publicAPI,
    timeout: 10000,
});

// Helper 
const toError = (err: unknown): Error =>
    err instanceof Error
        ? err
        : new Error(
            typeof err === "string"
                ? err
                : err && (err as any).message
                    ? String((err as any).message)
                    : String(err),
        );

// Request Interceptor
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // อย่าแนบ token ใน public routes
        const publicRoutes = ["v1/auth/login", "v1/auth/register", "v1/auth/refresh"];
        if (publicRoutes.some(route => config.url?.includes(route))) {
            return config;
        }

        // แนบ token ใน protected routes
        const state = store.getState() as any;
        const token = state.auth?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(toError(error))
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
            !originalRequest.url?.includes("v1/auth/refresh") &&
            !originalRequest.url?.includes("v1/auth/login") &&
            !originalRequest.url?.includes("v1/auth/register")
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

                const res = await refreshClient.post("/v1/auth/refresh", { refresh_token });

                const { access_token, user } = res.data;
                
                // บันทึก tokens ใหม่
                const { exp } = jwtDecode<{exp: number}>(access_token)
                store.dispatch(setCredentials({ user, accessToken: access_token, expiresAt: exp * 1000 }))
                // if (newRefreshToken) {
                //     localStorage.setItem("refresh_token", newRefreshToken);
                // }

                console.log("✅ Token refreshed successfully");

                // Retry request เดิมด้วย token ใหม่
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error("❌ Failed to refresh token:", refreshError);
                
                // logout and redirect
                store.dispatch(logout())
                window.location.href = "/login";
                
                return Promise.reject(toError(refreshError));
            }
        }

        if (error.response?.status === 403) {
            store.dispatch(logout());
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            return Promise.reject(
                new Error("Account inactive or no permission to access this resource.")
            );
        }

        return Promise.reject(toError(error));
    }
);