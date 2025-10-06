"use client";

import CustomInput from "@/src/components/CustomInput";
import { Button, Link } from "@heroui/react";
import { useState } from "react";
import { useHandleRegisterSubmit } from "@/src/services/authService/handlers";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = useHandleRegisterSubmit();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await handleRegister(form, setMsg, setLoading);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[400px]">
      <h1 className="text-2xl font-semibold mb-10 text-center">Register</h1>
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
        <CustomInput
          name="full_name"
          label="Full Name"
          type="text"
          placeholder="Your name"
          svgSrc="/icons/user-round.svg"
          isRequired
        />
        <CustomInput
          name="email"
          label="Email"
          type="email"
          placeholder="you@ku.th"
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
        <CustomInput
          name="confirm_password"
          label="Confirm Password"
          type="password"
          placeholder="********"
          svgSrc="/icons/password.svg"
          isRequired
        />
        <CustomInput
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="0xxxxxxxxx"
          svgSrc="/icons/phone.svg"
          isRequired
        />

        {msg && <p className="text-center text-red-600 text-sm">{msg}</p>}

        <div className="text-center">
          <Button color="primary" type="submit" className="mt-5 w-1/2" isLoading={loading}>
            Register
          </Button>
          <p className="pt-2">
            Already have an account?&nbsp;
            <Link href="/login" size="sm" underline="always">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
