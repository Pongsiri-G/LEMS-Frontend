"use client"

import { ReactNode } from "react"
import { useAuth } from "@/src/contexts/authContext"

type GuardProps = {
  roles?: ( "admin" | "user")[]
  children: ReactNode
  fallback?: ReactNode
}

export default function Guard({
  roles,
  children,
  fallback = null,
}: GuardProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <>{fallback}</>

  if (roles && user !== null && !roles.includes(user.userRole)) return <>{fallback}</>

  return <>{children}</>
}
