import { redirect, useRouter } from "next/navigation";
import { login } from "./login";
import { register } from "./register";
import { googleLogin } from "./googleLogin";
import { refreshToken } from "./refreshToken";
import { REFRES_TOKEN } from "@/src/constants/token";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/src/store";
import { logout, setCredentials, setUser } from "@/src/feature/authSlice";
import { useHandleGetMe } from "../userService/handlers";

export const useHandleLoginSubmit = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()

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

        if (result.success && result.data) {
            localStorage.setItem(REFRES_TOKEN, result.data.refresh_token)

            // dispatch auth state
            const { exp } = jwtDecode<Jwt>(result.data.access_token ?? "")
            dispatch(
                setCredentials({
                    accessToken: result.data.access_token ?? "",
                    expiresAt: exp * 1000,
                }),
            )
            // await getCurrentUser()

            try {
                const { user } = await useHandleGetMe()
                if (user) {

                    dispatch(
                        setUser({ user })
                    )
                }
            } catch (error) {
                dispatch(
                    logout()
                )
            }

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
            // Redirect to login with success message
            router.replace("/login?msg=" + encodeURIComponent(result.message ?? "ลงทะเบียนสำเร็จ กรุณารอผู้ดูแลระบบอนุมัติ"));
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