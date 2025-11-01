import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface NotificationState {
    items: Notification[];
}

const initialState: NotificationState = {
    items: [],
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            action.payload.read = false
            state.items.unshift(action.payload); // newest on top
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notif = state.items.find((n) => n.id === action.payload);
            if (notif) notif.read = true;
        },
        markAllRead: (state) => {
            state.items.forEach((i) => (i.read = true));
        },
        clearNotifications: (state) => {
            state.items = [];
        },
    },
});

export const { addNotification, markAsRead, clearNotifications, markAllRead } = notificationSlice.actions;
export const notiSelector = (s: { noti: NotificationState}) => s.noti
export default notificationSlice.reducer;
