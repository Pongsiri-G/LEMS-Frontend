import { useRouter } from "next/navigation";
import { login } from "./login";
import { register } from "./register";
import { googleLogin } from "./googleLogin";

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

        await googleLogin()
        
        localStorage.setItem("access_token", "dummy_access_token");
        localStorage.setItem("refresh_token", "dummy_refresh_token");

        router.replace("/");
        setLoading(false);
    };
};
