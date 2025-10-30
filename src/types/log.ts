import { formatThaiDate } from "../utils/FormatDate"

export interface Log {
  createAt: string
  logID: string
  logType: string
  message: string
  userID: string
  userName: string
}

export const toLog = (data: any): Log => {
  return {
    createAt: formatThaiDate(data["created_at"]),
    logID: data["log_id"],
    logType: data["log_type"],
    message: data["message"],
    userID: data["user_id"],
    userName: data["user_name"],
  }
}
