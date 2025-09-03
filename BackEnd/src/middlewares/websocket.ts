import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer | null = null;

export function initWSS(server?: any, port: number = 9091) {
  // Se você já tem um HTTP server (server.ts), prefira usar { server }
  wss = server ? new WebSocketServer({ server }) : new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: "hello", payload: "connected" }));
  });
  return wss;
}

export function broadcast(type: string, payload?: any) {
  if (!wss) return;
  const msg = JSON.stringify({ type, payload });
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(msg);
  }
}
