import { apiClient } from "../apiClient";

export const register = async ({
    full_name,
    email,
    password,
    phone,
}: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
}) => {
    try {
        const res = await apiClient.post<{ message: string }>("v1/user/register", {
            full_name,
            email,
            password,
            phone,
        });

        return { 
            success: res.status === 201, 
            status: res.status,
            message: res.data?.message || "ลงทะเบียนสำเร็จ กรุณารอผู้ดูแลระบบอนุมัติ"
        };
    } catch (err: any) {
        return {
            success: false,
            status: err?.response?.status || 500,
            error: err?.response?.data?.error || "Register failed",
        };
    }
};
