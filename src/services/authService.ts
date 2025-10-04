import { apiClient } from "./apiClient"

export const useAuthService = () => {
  const base = "auth"

  const googleLogin = () => {
    apiClient.get(`/v1/${base}/google/login`)
  }

  return {
    googleLogin,
  }
}
