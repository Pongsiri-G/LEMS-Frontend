"use client";

import CustomInput from "@/src/components/CustomInput";
import {Button, Link} from "@heroui/react";

import { useState } from "react";
import { useHandleGoogleLogin, useHandleLoginSubmit } from "@/src/services/authService/handlers";

export default function LoginPage(){
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = useHandleLoginSubmit();
    const handleGoogleLogin = useHandleGoogleLogin();
    
    const onLocalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        await handleLogin(form, setMsg, setLoading);
    };

    const onGoogleLogin = async () => {
        await handleGoogleLogin("dummy_id_token", setMsg, setLoading);
    };

    return (
        <div className="p-6 bg-background rounded-xl shadow-lg w-[400px]">
            <h1 className="text-3xl font-semibold mb-5 text-center">Login</h1>
            <div className="text-center">
                <Button name="google-login"
                        type="submit" 
                        className="w-4/5 mx-auto mb-2 bg-neutral-second "
                        onClick={onGoogleLogin}
                        isLoading={loading}
                        >
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <img
                            src="/icons/google-icon.svg"
                            className="w-5 h-5"
                        />
                    </div>
                    Continue with Google
                </Button>
                <p className="text-2xl text-center">Or</p>
            </div>
            <form onSubmit={onLocalSubmit} className="w-full max-w-md space-y-4">
                <CustomInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@gmail.com"
                    svgSrc="/icons/mail.svg"
                    isRequired
                />
                <CustomInput
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="********"
                    svgSrc="/icons/password.svg"
                    isRequired
                />

                {msg && <p className="text-center text-red-600 text-sm">{msg}</p>}

                <div className="text-center">
                    <Button color="primary" type="submit" className="mt-5 w-1/2" isLoading={loading}>
                        Login
                    </Button>
                    <p className="pt-2">Don't have an account&nbsp;
                    <Link href="/register" size="sm" underline="always">
                    Register
                    </Link>
                    </p>
                </div>
                
            </form>
        </div>
      );
}