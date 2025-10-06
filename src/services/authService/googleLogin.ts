import { redirect } from "next/navigation";
import { apiClient } from "../apiClient";

export const googleLogin = async () => {
    try {
        const res = await apiClient.get<string>(`v1/auth/google/login`)
        return res.data
    } catch (err: any) {
        return {
            success: false,
            status: err?.response?.status || 500,
            error: err?.response?.data?.error || "Login failed",
        };
    }
};
