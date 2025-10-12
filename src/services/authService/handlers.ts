import { redirect, useRouter } from "next/navigation";
import { login } from "./login";
import { register } from "./register";
import { googleLogin } from "./googleLogin";
import { refreshToken } from "./refreshToken";
import { REFRES_TOKEN } from "@/src/constants/token";
import { jwtDecode } from "jwt-decode";

export const useHandleLoginSubmit = () => {
    const router = useRouter();

    return async (
        form: FormData,
        setMsg: (msg: string) => void,
        setLoading: (loading: boolean) => void
    ) => {
        setLoading(true);
        setMsg("");

        const email = String(form.get("email"));
        const password = String(form.get("password"));

        const result = await login({ email, password });

        if (result.success) {
            router.replace("/");
        } else {
            setMsg(result.error ?? "Login failed");
        }

        setLoading(false);
    };
};

export const useHandleRegisterSubmit = () => {
    const router = useRouter();

    return async (
        form: FormData,
        setMsg: (msg: string) => void,
        setLoading: (loading: boolean) => void
    ) => {
        setLoading(true);
        setMsg("");

        const full_name = String(form.get("full_name"));
        const email = String(form.get("email"));
        const password = String(form.get("password"));
        const confirmPassword = String(form.get("confirm_password"));
        const phone = String(form.get("phone"));

        if (password !== confirmPassword) {
            setMsg("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            setMsg("Phone number must be 10 digits");
            setLoading(false);
            return;
        }

        const result = await register({ full_name, email, password, phone });

        if (result.success) {
            router.replace("/login");
        } else {
            setMsg(result.error ?? "Register failed");
        }

        setLoading(false);
    };
};

export const useHandleGoogleLogin = () => {
    const router = useRouter();

    return async (
        setMsg: (msg: string) => void,
        setLoading: (loading: boolean) => void
    ) => {
        setLoading(true);
        setMsg("");

        const res = await googleLogin();

        if (typeof res === "string") {
            redirect(res)
        } else if (res && res.success) {
            router.replace("/");
        } else {
            setMsg("Google login failed");
        }
        
        setLoading(false);
    };
};

export const useHandleRefreshToken = async () => {
    const res = await refreshToken(localStorage.getItem(REFRES_TOKEN) ?? "")
    if (!res.success || !res.data ) throw new Error("refresh failed");
    const { access_token: newToken, user: newUser } = res.data;

    const { exp } = jwtDecode<Jwt>(newToken);

    return {
        user: newUser,
        accessToken: newToken,
        expiresAt: exp * 1000
    }
}