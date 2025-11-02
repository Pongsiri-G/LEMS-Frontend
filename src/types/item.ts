export enum PrePage {
  MYBORROW = "my-borrow",
  BORROWRETURN = "borrow-return",
  EQUIPMENTMANAGE = "equipment-manage",
}

export interface Item {
  itemID: string
  itemName: string
  itemDescription: string
  itemPictureURL: string
  itemStatus: string
  itemQuantity: number
  itemCurrentQuantity: number
  createdAt: Date
  updatedAt: Date
}

export const toItem = (data: any): Item => {
  return {
    itemID: data["id"],
    itemName: data["name"],
    itemDescription: data["desc"],
    itemPictureURL: data["picture_url"],
    itemStatus: data["status"],
    itemQuantity: Number(data["quantity"]),
    itemCurrentQuantity: Number(data["current_quantity"]),
    createdAt: new Date(data["created_at"]),
    updatedAt: new Date(data["updated_at"]),
  }
}
