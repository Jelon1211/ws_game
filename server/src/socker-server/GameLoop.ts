import {Server as IOServer, Socket} from "socket.io";

type Vec2 = {
  x: number;
  y: number;
};

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
const GRAVITY = 500; // px/s² (siła grawitacji)
const JUMP_SPEED = -300; // px/s (skok w górę)
const WORLD = {w: 900, h: 600};
const FLOOR_Y = WORLD.h; // "ziemia" na dole świata
const COYOTE_TIME = 100; // ms

type Player = {
  id: string;
  pos: Vec2;
  vel: Vec2;
  lastProcessedSeq: number;
  onGround: boolean;
  lastGroundedTime: number;
};

export class GameLoop {
  private io: IOServer;
  private players: Map<string, Player> = new Map();

  private last = Date.now();
  private snapshotAccumulator = 0;

  constructor(io: IOServer) {
    this.io = io;
  }

  public start() {
    this.io.on("connection", (socket: Socket) => {
      this.onJoin(socket);

      socket.on("input", (msg: InputMsg) => {
        this.onInput(socket, msg);
      });

      socket.on("disconnect", () => {
        this.onLeave(socket);
      });
    });

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

    let vx = 0;
    if (msg.left) vx -= SPEED;
    if (msg.right) vx += SPEED;

    p.vel.x = vx;

    // Skok tylko jeśli stoi na ziemi
    if (msg.up && p.onGround) {
      p.vel.y = JUMP_SPEED;
      p.onGround = false;
    }

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

    for (const p of this.players.values()) {
      // grawitacja
      p.vel.y += GRAVITY * dt;

      // integracja
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;

      // ściany poziome
      p.pos.x = Math.max(0, Math.min(WORLD.w, p.pos.x));

      // ziemia
      if (p.pos.y >= FLOOR_Y) {
        p.pos.y = FLOOR_Y;
        p.vel.y = 0;
        p.onGround = true;
      }
    }

    // snapshoty (jak było)
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
