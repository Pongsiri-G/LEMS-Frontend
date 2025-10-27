import { formatThaiDate } from "../utils/FormatDate"

export interface BorrowLog {
  borrowID: string
  itemName: string
  borrowDate: Date
  returnDate: Date
  borrowStatus: string
}

export interface BorrowLogAdmin {
  userName: string
  borrowID: string
  itemName: string
  borrowDate: string
  returnDate: string
  borrowStatus: string
}

export const toBorrowLogAdmin = (data: any) => {
  return {
    userName: data["user_name"],
    borrowID: data["borrow_id"],
    itemName: data["item_name"],
    borrowDate: formatThaiDate(data["borrow_date"]),
    returnDate: formatThaiDate(data["return_date"]),
    borrowStatus: data["borrow_status"],
  }
}
