"use client"

import { ReactNode, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { authSelector, setProccessing } from "../feature/authSlice"
import { useRouter } from "next/navigation"
import { UserRoles } from "../constants/user"
import { useAppDispatch } from "../store"

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode
  roles?: ("ADMIN" | "USER")[]
}) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const { isAuthenticated, user } = useSelector(authSelector)

  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    } else if (roles && !roles.includes(user?.userRole as "ADMIN" | "USER")) {
      router.replace("/403")
    }
    setLoading(false)
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  // if (isLoading) return <p>Loading...</p>

  return <div>{children}</div>
}
