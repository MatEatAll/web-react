// scripts/mock-stomp-broker.js
// 초간단 STOMP-over-WebSocket 목 브로커 (개발용)

const { WebSocketServer } = require("ws");

const PORT = 8081;
const PATH = "/ws-stomp";

const wss = new WebSocketServer({ port: PORT, path: PATH });
console.log(`[mock-stomp] listening ws://localhost:${PORT}${PATH}`);

const subs = new Map();
let nextMsgId = 1;

function parseFrame(data) {
  const frames = String(data).split("\0").filter(Boolean);
  return frames.map((raw) => {
    const [start, ...rest] = raw.split("\n");
    const command = start.trim();
    const headers = {};
    let body = "";
    for (let i = 0; i < rest.length; i++) {
      const line = rest[i];
      if (line === "") {
        body = rest.slice(i + 1).join("\n");
        break;
      }
      const idx = line.indexOf(":");
      if (idx > -1) {
        headers[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    }
    return { command, headers, body };
  });
}

function buildFrame(command, headers = {}, body = "") {
  const headerLines = Object.entries(headers).map(([k, v]) => `${k}:${v}`);
  return `${command}\n${headerLines.join("\n")}\n\n${body}\0`;
}

function appToTopic(dest) {
  if (dest.startsWith("/app/rooms.") && dest.endsWith(".send")) {
    return dest.replace("/app/", "/topic/").replace(/\.send$/, "");
  }
  return dest;
}

wss.on("connection", (ws) => {
  console.log("[mock-stomp] client connected");
  subs.set(ws, new Map());

  ws.on("message", (data) => {
    parseFrame(data).forEach(({ command, headers, body }) => {
      switch (command) {
        case "CONNECT": {
          ws.send(buildFrame("CONNECTED", { version: "1.2" }));
          break;
        }
        case "SUBSCRIBE": {
          const id = headers.id || String(Math.random());
          const dest = headers.destination;
          subs.get(ws).set(id, dest);
          break;
        }
        case "SEND": {
          const dest = headers.destination;
          const broadcastDest = appToTopic(dest);
          wss.clients.forEach((cli) => {
            const s = subs.get(cli);
            if (!s) return;
            for (const [subId, subDest] of s.entries()) {
              if (subDest === broadcastDest) {
                cli.send(
                  buildFrame(
                    "MESSAGE",
                    { subscription: subId, destination: broadcastDest, "message-id": String(nextMsgId++) },
                    body
                  )
                );
              }
            }
          });
          break;
        }
        case "DISCONNECT": {
          ws.close();
          break;
        }
      }
    });
  });

  ws.on("close", () => {
    subs.delete(ws);
    console.log("[mock-stomp] client disconnected");
  });
});
