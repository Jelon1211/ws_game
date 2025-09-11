import {Server as IOServer, Socket} from "socket.io";

type Vec2 = {x: number; y: number};
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
const WORLD = {w: 900, h: 600};

type Player = {
  id: string;
  pos: Vec2;
  vel: Vec2;
  lastProcessedSeq: number;
};

export class GameLoop {
  private io: IOServer;
  private players: Map<string, Player> = new Map();

  // dokładnie jak u Ciebie
  private last = Date.now();
  private snapshotAccumulator = 0;

  constructor(io: IOServer) {
    this.io = io;
  }

  public start() {
    // WS handlers
    this.io.on("connection", (socket: Socket) => {
      this.onJoin(socket);

      socket.on("input", (msg: InputMsg) => {
        this.onInput(socket, msg);
      });

      socket.on("disconnect", () => {
        this.onLeave(socket);
      });
    });

    // pętla serwera 30 Hz
    setInterval(() => this.tick(), 1000 / TICK_RATE);
  }

  private onJoin(socket: Socket) {
    const spawn: Player = {
      id: socket.id,
      pos: {x: 200 + Math.random() * 200, y: 200},
      vel: {x: 0, y: 0},
      lastProcessedSeq: 0,
    };
    this.players.set(socket.id, spawn);

    // identycznie jak wcześniej
    socket.emit("hello", {id: socket.id, world: WORLD});
    console.log("join", socket.id);
  }

  private onInput(socket: Socket, msg: InputMsg) {
    const p = this.players.get(socket.id);
    if (!p) return;

    // identyczny model prędkości jak u Ciebie
    let vx = 0,
      vy = 0;
    if (msg.left) vx -= SPEED;
    if (msg.right) vx += SPEED;
    if (msg.up) vy -= SPEED;
    if (msg.down) vy += SPEED;

    p.vel.x = vx;
    p.vel.y = vy;
    p.lastProcessedSeq = msg.seq;
  }

  private onLeave(socket: Socket) {
    this.players.delete(socket.id);
    console.log("leave", socket.id);
  }

  private tick() {
    const now = Date.now();
    const dt = (now - this.last) / 1000;
    this.last = now;
    this.snapshotAccumulator += dt;

    // Integracja ruchu + ściany świata (1:1)
    for (const p of this.players.values()) {
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.pos.x = Math.max(0, Math.min(WORLD.w, p.pos.x));
      p.pos.y = Math.max(0, Math.min(WORLD.h, p.pos.y));
    }

    // Snapshoty 20 Hz (1:1)
    const snapInterval = 1 / SNAPSHOT_RATE;
    if (this.snapshotAccumulator >= snapInterval) {
      this.snapshotAccumulator = 0;
      const snapshot = Array.from(this.players.values()).map((p) => ({
        id: p.id,
        x: p.pos.x,
        y: p.pos.y,
        lastProcessedSeq: p.lastProcessedSeq,
      }));
      this.io.emit("state", {t: now, players: snapshot});
    }
  }
}
