import config from "../configs/config";

let socket: WebSocket | null = null;

export function connectWebSocket(userId: string) {
    if (socket && socket.readyState === WebSocket.OPEN) return socket;

    // const ws = new WebSocket(`${config.wsURL}?accTk=Bearer ${accessToken}`) 
    const ws = new WebSocket(`${config.wsURL}?userId=${userId}`) 

    ws.onopen = () => console.log("[WebSocket] Connected");
    ws.onclose = () => console.log("[WebSocket] Disconnected");
    // ws.onerror = (err) => console.error("[WebSocket] Error", err);

    socket = ws;
    return ws;
}

export function getSocket() {
    return socket;
}

export function disconnectWebSocket() {
    if (socket) socket.close();
}
