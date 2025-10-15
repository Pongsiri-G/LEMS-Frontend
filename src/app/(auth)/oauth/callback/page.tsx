"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function OAuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const accessToken = searchParams.get("accessToken")
  const refreshToken = searchParams.get("refreshToken")

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)
      router.push("/") 
    } else {
      router.back()
    }
  }, [router])

  if (!accessToken || !refreshToken) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-lg">Processing login...</h1>
    </div>
  )
}
