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
      router.push("/")
    } else if ((!accessToken || !refreshToken) && !massage) {
      router.back()
    }
  }, [])

  const onGetMe = async () => {
    const { user }= await useHandleGetMe()
    if (user) {
      
      dispatch(
        setUser({ user }),
      )
    }
  }

  if (!accessToken || !refreshToken) {
    if (massage) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl text-red-500">{massage}</h1>
        </div>
      )
    }
    return null
  } 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl">Processing login...</h1>
    </div>
  )
}
