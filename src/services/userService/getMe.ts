import { User } from "@/src/types";
import { apiClient } from "../apiClient";

export const getMe = async () => {
    try {
        const res = await apiClient.get<User>("/v1/user/me");

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
