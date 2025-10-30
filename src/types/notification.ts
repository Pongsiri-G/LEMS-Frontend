interface NotiMassage {
    massage: string
    type: string
    userId: string
}


interface Notification {
    id: string
    message: string
    type: string
    userId: string
    createdAt: string;
    read: boolean;
    itemId?: string;
}
