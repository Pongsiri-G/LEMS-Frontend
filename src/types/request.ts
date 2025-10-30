type RequestForm = {
    request_id: string
    request_item_name: string,
    request_type: string,
    request_status: string,
    request_image_url: string,
    request_description: string,
    created_by: string,
    created_date: string,
    updated_date: string
    item_requested?: {
        name: string,
        description: string,
        type: string,
        quantity: number,
        price: number
    }
    item_id?: string
}