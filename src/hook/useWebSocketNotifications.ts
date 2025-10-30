"use client";

import { useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "../lib/wsClient";
import { useAppDispatch } from "../store";
import { useAppSelector } from "./useAppSelector";
import { authSelector } from "../feature/authSlice";
import { addNotification } from "../feature/notificationSlice";
import { addToast } from "@heroui/react";

export function useWebSocketNotifications() {
    const { user, isAuthenticated, accessToken } = useAppSelector(authSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const ws = connectWebSocket(user.userId);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as Notification;
                dispatch(addNotification(data)); // backend sends {id, message, createdAt, read:false}
                
                addToast({
                    hideIcon: true,
                    title: data.type,
                    description: data.message,
                    classNames: {
                        closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
                        base: "border border-primary"
                    },
                })

                
            } catch (err) {
                console.error("[WebSocket] Invalid message", err);
            }
        };

        return () => {
            disconnectWebSocket();
        };
    }, [isAuthenticated, user, dispatch, accessToken]);
}
