import { apiClient } from "../apiClient";
import { User, UserStatus, UserRole } from "@/src/types/user";

export type UserQueryParams = {
  status?: UserStatus | "ALL";
  role?: UserRole;
  q?: string;
  sort?: string;
};

function mapUser(x: any): User {
  return {
    userId: x.user_id,
    userFullName: x.user_fullname,
    userEmail: x.user_email,
    userPhone: x.user_phone,
    userRole: x.user_role as UserRole,
    userStatus: x.user_status as UserStatus,
    userProfileUrl: x.user_profile_url ?? null,
    authProvider: x.auth_provider,
    lastLoggedIn: x.last_logged_in ?? null,
  };
}

// ดึง Users (role=USER ตามค่าเริ่มต้น)
export async function getUsers(params?: UserQueryParams): Promise<User[]> {
  const query: Record<string, string> = {};
  if (params?.role) query.role = params.role;
  // "ALL" = ไม่ส่ง status
  if (params?.status && params.status !== "ALL") query.status = params.status;
  if (params?.q) query.q = params.q;
  if (params?.sort) query.sort = params.sort;

  const res = await apiClient.get("/v1/admin/users", { params: query });
  const raw = (res.data?.data ?? res.data ?? []) as any[];
  const users = raw.map(mapUser);

  // ถ้าหน้านี้ใช้เพื่อดู USER เท่านั้น ให้กรอง role=USER โดยปริยาย
  if (!params?.role) {
    return users.filter((u) => u.userRole === UserRole.User);
  }
  return users;
}

// ดึง Admins (role=ADMIN)
export async function getAdmins(params?: Omit<UserQueryParams, "role">): Promise<User[]> {
  const res = await apiClient.get("/v1/admin/users", {
    params: {
      ...(params?.status && params.status !== "ALL" ? { status: params.status } : {}),
      ...(params?.q ? { q: params.q } : {}),
      ...(params?.sort ? { sort: params.sort } : {}),
      role: UserRole.Admin,
    },
  });
  const raw = (res.data?.data ?? res.data ?? []) as any[];
  return raw.map(mapUser);
}
