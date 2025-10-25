import { apiClient } from "../apiClient";

export const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        const res = await apiClient.post<{ access_token: string, refresh_token: string}>("v1/auth/login", { email, password });

        return { success: true, status: res.status, data: res.data };
    } catch (err: any) {
        return {
            success: false,
            status: err?.response?.status || 500,
            error: err?.response?.data?.error || "Login failed",
            data: null
        };
    }
};
