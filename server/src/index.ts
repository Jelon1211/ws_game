import express from "express";
import http from "http";
import { Server } from "socket.io";

type Vec2 = { x: number; y: number };
type InputMsg = {
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
  seq: number;
};

const TICK_RATE = 30; // 30 Hz – pętla serwera
const SNAPSHOT_RATE = 20; // 20 Hz – wysyłanie stanu
const SPEED = 120; // px/s
const WORLD: { w: number; h: number } = { w: 900, h: 600 };

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

type Player = {
  id: string;
  pos: Vec2;
  vel: Vec2;
  lastProcessedSeq: number;
};

const players = new Map<string, Player>();

app.get("/", (_req, res) => res.send("OK"));

io.on("connection", (socket) => {
  const spawn: Player = {
    id: socket.id,
    pos: { x: 200 + Math.random() * 200, y: 200 },
    vel: { x: 0, y: 0 },
    lastProcessedSeq: 0,
  };
  players.set(socket.id, spawn);

  socket.emit("hello", { id: socket.id, world: WORLD });
  console.log("join", socket.id);

  socket.on("input", (msg: InputMsg) => {
    const p = players.get(socket.id);
    if (!p) return;
    // Ustal prędkość wg wejścia (tu bez akceleracji/grawitacji – prosto)
    let vx = 0,
      vy = 0;
    if (msg.left) vx -= SPEED;
    if (msg.right) vx += SPEED;
    if (msg.up) vy -= SPEED;
    if (msg.down) vy += SPEED;
    p.vel.x = vx;
    p.vel.y = vy;
    p.lastProcessedSeq = msg.seq;
  });

  socket.on("disconnect", () => {
    players.delete(socket.id);
    console.log("leave", socket.id);
  });
});

// Pętla serwera
let accTime = 0;
let last = Date.now();
let snapshotAccumulator = 0;

setInterval(() => {
  const now = Date.now();
  const dt = (now - last) / 1000;
  last = now;
  accTime += dt;
  snapshotAccumulator += dt;

  // Integracja ruchu
  for (const p of players.values()) {
    p.pos.x += p.vel.x * dt;
    p.pos.y += p.vel.y * dt;

    // Ściany świata
    p.pos.x = Math.max(0, Math.min(WORLD.w, p.pos.x));
    p.pos.y = Math.max(0, Math.min(WORLD.h, p.pos.y));
  }

  // Snapshoty
  const snapInterval = 1 / SNAPSHOT_RATE;
  if (snapshotAccumulator >= snapInterval) {
    snapshotAccumulator = 0;
    const snapshot = Array.from(players.values()).map((p) => ({
      id: p.id,
      x: p.pos.x,
      y: p.pos.y,
      lastProcessedSeq: p.lastProcessedSeq,
    }));
    io.emit("state", { t: now, players: snapshot });
  }
}, 1000 / TICK_RATE);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("server on", PORT));
