"use client"

import { REFRES_TOKEN } from "@/src/constants/token"
import { setCredentials, setUser } from "@/src/feature/authSlice"
import { useHandleGetMe } from "@/src/services/userService/handlers"
import { useAppDispatch } from "@/src/store"
import { jwtDecode } from "jwt-decode"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function OAuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const dispatch = useAppDispatch()

  const handleGetMe = useHandleGetMe()

  const accessToken = searchParams.get("accessToken")
  const refreshToken = searchParams.get("refreshToken")
  const massage = searchParams.get("msg")

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem(REFRES_TOKEN, refreshToken)

      const { exp } = jwtDecode<Jwt>(accessToken ?? "")
      dispatch(
        setCredentials({
          accessToken: accessToken ?? "",
          expiresAt: exp * 1000,
        }),
      )

      onGetMe()
    } else if (massage) {
      // Redirect to login page with error/success message
      router.replace("/login?msg=" + encodeURIComponent(massage))
    } else if (!accessToken || !refreshToken) {
      router.back()
    }
  }, [])

  const onGetMe = async () => {
    const result = await handleGetMe
    const { user } = result ?? {}
    if (user) {
      dispatch(setUser({ user }))
      router.push("/")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl">Processing login...</h1>
    </div>
  )
}
