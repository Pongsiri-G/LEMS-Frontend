"use client"

import { ReactNode } from "react"
import useAuthGuard from "../hook/useAuthGuard"

type GuardProps = {
  children: ReactNode
}

export default function AuthGuard({
  children,
}: GuardProps) {
  useAuthGuard()

  return <div>{children}</div>
}
