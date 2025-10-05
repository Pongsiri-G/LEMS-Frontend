"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/contexts/authContext"

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode
  roles?: ("admin" | "user")[]
}) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    } else if (roles && user) { // !roles.includes(user.role)
      router.replace("/403")
    }
  }, [isAuthenticated, user, roles, router])

  if (!isAuthenticated) return null

  return <div>{children}</div>
}
