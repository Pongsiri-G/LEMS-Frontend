"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../feature/authSlice";

export default function useWebSocket(url: string) {
    const [messages, setMessages] = useState<NotiMassage[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const { accessToken } = useSelector(authSelector)

    useEffect(() => {
        const ws = new WebSocket(`${url}?accTk=Bearer ${accessToken}`) 
        ws.onopen = () => console.log("✅ Connected to WebSocket");
        ws.onmessage = (e) => {
            try {
                const msg: NotiMassage = JSON.parse(e.data);
                setMessages((prev) => [...prev, msg]);
            } catch {
                console.warn("Invalid message:", e.data);
            }
        };
        ws.onclose = () => console.log("❌ WebSocket closed");
        setSocket(ws);

        return () => ws.close();
    }, [url]);

    return { messages, socket };
}
