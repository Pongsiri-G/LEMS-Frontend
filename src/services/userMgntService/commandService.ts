import { apiClient } from "../apiClient";

// user
export async function acceptUser(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/accept`);
}
export async function rejectUser(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/reject`);
}
export async function activateUser(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/activate`);
}
export async function deactivateUser(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/deactivate`);
}
export async function deleteUser(userId: string) {
  return apiClient.delete(`/v1/admin/user/${userId}`);
}

// admin
export async function revokeAdmin(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/revoke-admin`);
}

export async function grantAdmin(userId: string) {
  return apiClient.post(`/v1/admin/user/${userId}/grant-admin`);
}