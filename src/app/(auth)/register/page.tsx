"use client";

import CustomInput from "@/src/components/CustomInput";
import {Button, Link} from "@heroui/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/src/services/apiClient";

export default function RegisterPage() {
    const router = useRouter();
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

      // State สำหรับ input field
    const [full_name, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMsg("");

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

        try {
            const res = await apiClient.post("/auth/register", {
                full_name,
                email,
                password,
                phone: phone
            });
            if (res.status === 201) {
                router.replace("/login");
            } else {
                const errorMsg = typeof res.data?.error === "string" ? res.data.error : `error ${res.status}`;
                setMsg(errorMsg);
            }
        } catch (err: any) {
            setMsg(err?.response?.data?.error ?? "Register failed");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[400px]">
        <h1 className="text-2xl font-semibold mb-10 text-center">Register</h1>
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
            <CustomInput
                label="Full Name"
                type="text"
                placeholder="Your name"
                svgSrc="/icons/user-round.svg"
                isRequired
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
            />
            <CustomInput
                label="Email"
                type="email"
                placeholder="you@ku.th"
                svgSrc="/icons/mail.svg"
                isRequired
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <CustomInput
                label="Password"
                type="password"
                placeholder="********"
                svgSrc="/icons/password.svg"
                isRequired
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <CustomInput
                label="Confirm Password"
                type="password"
                placeholder="********"
                svgSrc="/icons/password.svg"
                isRequired
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <CustomInput
                label="Phone Number"
                type="tel"
                placeholder="0xxxxxxxxx"
                svgSrc="/icons/phone.svg"
                isRequired
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            {msg && <p className="text-center text-red-600 text-sm">{msg}</p>}

            <div className="text-center">
                <Button color="primary" type="submit" className="mt-5 w-1/2" isLoading={loading}>
                    Register
                </Button>
                <p className="pt-2">Already have an account?&nbsp;
                <Link href="/login" size="sm" underline="always">
                Login
                </Link>
                </p>
            </div>
            
        </form>
    </div>
  );
}
