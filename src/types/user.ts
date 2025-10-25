export interface User {
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  userRole: "ADMIN" | "USER"
  userStatus: UserStatus
  userProfileUrl: string
  authProvider: string
  lastLoggedIn: string | null
};

export enum UserRole {
  Admin = "ADMIN",
  User = "USER",
}

export enum UserStatus {
  Pending = "PENDING",
  Active = "ACTIVE",
  Rejected = "REJECTED",
  Deactivated = "DEACTIVATED",
}
