export interface User {
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  userRole: "ADMIN" | "USER"
  userStatus: string
  userProfileUrl: string
  authProvider: string
  lastLoggedIn: string
};
