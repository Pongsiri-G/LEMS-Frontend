"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { User } from "../types"
import { ACCESS_TOKEN } from "../constants/token"

type AuthContextType = {
  user: User | null
  token: string | null
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN)
    // const storedUser = localStorage.getItem("user")
    if (storedToken) {
      setToken(storedToken)
      // setUser(parse(storedUser))
    }
    
    setIsLoading(false)
  }, [])

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        logout,
        isLoading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
