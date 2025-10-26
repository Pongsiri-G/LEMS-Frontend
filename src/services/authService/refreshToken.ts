import { User } from "@/src/types";
import { apiClient } from "../apiClient";

export const refreshToken = async (refreshToken: string) => {
    try {
        const res = await apiClient.post<{ access_token: string, user: User}>("/v1/auth/refresh", { refresh_token: refreshToken });

        return { 
            success: true, 
            status: res.status,
            data: res.data
        };
    } catch (err: any) {
        return {
            success: false,
            status: err?.response?.status || 500,
            error: err?.response?.data?.error || "Login failed",
        };
    }
};
