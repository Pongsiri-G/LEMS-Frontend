"use client"

import { ReactNode } from "react"
import useAuthGuard from "../hook/useAuthGuard"
import { useWebSocketNotifications } from "../hook/useWebSocketNotifications"

type GuardProps = {
  readonly children: ReactNode
}

export default function AuthGuard({
  children,
}: GuardProps) {
  useAuthGuard()
  useWebSocketNotifications()
  
  return <div>{children}</div>
}
