export interface Tag {
  id: string
  name: string
  color: string
}

export const toTag = (data: any): Tag => {
  return {
    id: data["id"],
    name: data["name"],
    color: data["color"],
  }
}
