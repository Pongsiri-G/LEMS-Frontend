import { apiClient } from "../apiClient";

export const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        const res = await apiClient.post("v1/auth/login", { email, password });

        const { access_token, refresh_token } = res.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        return { success: true, status: res.status };
    } catch (err: any) {
        return {
            success: false,
            status: err?.response?.status || 500,
            error: err?.response?.data?.error || "Login failed",
        };
    }
};
