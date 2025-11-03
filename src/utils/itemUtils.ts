import { apiClient } from "../services/apiClient";
import { Item } from "../types/item";

export const fetchItemDetail = async (name: string, tag:string, status:string, borrowed?: string) => {
    const query = name || tag || status || borrowed
    let url = query
    ? `/v1/item/list/search?name=${encodeURIComponent(name ?? "")}&tags=${encodeURIComponent(tag ?? "")}&status=${encodeURIComponent(status ?? "")}&user=${encodeURIComponent(borrowed ?? "")}`
    : `/v1/item/list`
    console.log("Fetching from URL:", url);
    const res = await apiClient.get(url)
    const data = res.data
    let response: Item[] = data
    let items: Item[] = []
    if (!response || response.length === 0) {
        return items;
    }
    for (let i = 0; i < response.length; i++) {
    const item: Item = {
        itemID: data[i]["id"],
        itemName: data[i]["name"],
        itemDescription: data[i]["desc"],
        itemPictureURL: data[i]["picture_url"],
        itemStatus: data[i]["status"],
        itemQuantity: data[i]["quantity"],
        itemCurrentQuantity: data[i]["current_quantity"],
        createdAt: new Date(data[i]["created_at"]),
        updatedAt: new Date(data[i]["updated_at"])
    }
    items.push(item)
    }

    return items;
}