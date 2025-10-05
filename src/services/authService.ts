import { apiClient } from "./apiClient"

export const useAuthService = () => {
  const base = "auth"

  const googleLogin = async() => {
    const res = await apiClient.get<string>(`/v1/${base}/google/login`)
    return res
  }

  const googleCallback = async(code: string) => {
    const res = await apiClient.get(`/v1/${base}/google/callback`)
    console.dir(res)
  }

  return {
    googleLogin,
    googleCallback
  }
}
