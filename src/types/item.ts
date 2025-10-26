interface Item {
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

interface ItemBorrow {
  itemID: string
  itemName: string
  itemDescription: string
  itemPictureURL: string
  itemStatus: string
  itemQuantity: number
  itemCurrentQuantity: number
  createdAt: Date
  updatedAt: Date
  borrowID: string
}
