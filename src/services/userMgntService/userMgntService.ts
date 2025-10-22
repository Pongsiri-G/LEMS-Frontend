import { apiClient } from "../apiClient";
import { User, UserStatus } from "@/src/types/user";

export async function getAllUsers(): Promise<User[]> {
  const res = await apiClient.get("/v1/admin/users");
  return (res.data as any[]).map((x) => ({
    userId: x.user_id,
    userFullName: x.user_fullname,
    userEmail: x.user_email,
    userPhone: x.user_phone,
    userRole: x.user_role as "ADMIN" | "USER",
    userStatus: x.user_status as UserStatus,
    userProfileUrl: x.user_profile_url ?? null,
    authProvider: x.auth_provider,
    lastLoggedIn: x.last_logged_in ?? null,
  }));
}

export async function acceptUser(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/accept`);
}

export async function rejectUser(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/reject`);
}

export async function deactivateUser(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/deactivate`);
}

export async function deleteUser(userId: string) {
  return apiClient.delete(`/v1/admin/user/${userId}`);
}
