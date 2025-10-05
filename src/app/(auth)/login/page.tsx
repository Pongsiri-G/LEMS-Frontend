"use client";

import CustomInput from "@/src/components/CustomInput"
import { Button, Link } from "@heroui/react"

import { useEffect, useState } from "react"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/src/services/apiClient"
import { useAuthService } from "@/src/services/authService"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  const router = useRouter()
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const { googleLogin } = useAuthService()

  async function googleLoginHandler() {
    const url = await googleLogin()
    redirect(url.data)
  }

  async function onLocalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMsg("")

    const form = new FormData(e.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))

    // ⭐ Debug: ดูว่าส่งอะไรไป
    console.log("📤 Sending login request:", { email, password })

    try {
      const res = await apiClient.post("/v1/auth/login", { email, password })

      // ⭐ Debug: ดู response ที่ได้กลับมา
      console.log("📥 Response status:", res.status)
      console.log("📥 Response data:", res.data)

      if (res.status === 200) {
        console.log("📥 Login successful:")

        // 📦 เก็บไว้ใน localStorage
        const { access_token, refresh_token } = res.data
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("refresh_token", refresh_token)
        console.log("🎉 Tokens saved to localStorage")
        console.log("Access Token:", access_token)
        router.replace("/")
      } else {
        const errorMsg =
          typeof res.data?.error === "string"
            ? res.data.error
            : `error ${res.status}`
        console.log("⚠️ Non-200 status:", errorMsg)

        setMsg(errorMsg)
      }
    } catch (err: any) {
      // ⭐ Debug: ดู error ที่เกิดขึ้น
      console.log("❌ Login error occurred")
      console.log("Error status:", err?.response?.status)
      console.log("Error data:", err?.response?.data)
      console.log("Full error:", err)

      const errorMsg = err?.response?.data?.error ?? "login failed"
      setMsg(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-background rounded-xl shadow-lg w-[400px]">
      <h1 className="text-3xl font-semibold mb-5 text-center">Login</h1>
      <div className="text-center">
        <Button
          name="google-login"
          type="submit"
          className="w-4/5 mx-auto mb-2 bg-neutral-second"
          onPress={googleLoginHandler}
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <img src="/icons/google-icon.svg" className="w-5 h-5" />
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
          <Button
            color="primary"
            type="submit"
            className="mt-5 w-1/2"
            isLoading={loading}
          >
            Login
          </Button>
          <p className="pt-2">
            Don't have an account&nbsp;
            <Link href="/register" size="sm" underline="always">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
