"use client"

import useWebSocket from "../hook/useWebSocket"
import { useEffect } from "react"

export default function NotificationPanel() {
  const { messages } = useWebSocket("ws://localhost:8080/ws")

  useEffect(() => {
    if (messages.length > 0) {
      const latest = messages[messages.length - 1]
      console.log("🔔 Notification:", latest)
    }
  }, [messages])

  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="bg-white shadow-lg border rounded-lg px-4 py-2 text-gray-700"
        >
          <p className="font-bold">{msg.type || msg.userId}</p>
          <p className="text-sm">{msg.massage}</p>
        </div>
      ))}
    </div>
  )
}
