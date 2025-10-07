export interface User {
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  userRole:  "admin" | "user"
  userStatus: string
  userProfileURL: string
  authProvider: string
  lastLoggedIn: string
};
