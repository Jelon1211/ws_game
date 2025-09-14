import {Server as IOServer, Socket} from "socket.io";
import {GameWorld} from "./GameWorld";
import {Player} from "../models/Player";
import {InputMsg} from "../models/InputMsg";
import {Bodies} from "matter-js";
import {SNAPSHOT_RATE, TICK_RATE, WORLD} from "../constants";
import {PlayerController} from "../mechanics/PlayerController";
import {WorldBuilder} from "./WorldBuilder";

export class GameLoop {
  private io: IOServer;
  private world: GameWorld;
  private snapshotAccumulator = 0;

  constructor(io: IOServer, world: GameWorld) {
    this.io = io;
    this.world = world;
  }

  public start() {
    this.io.on("connection", (socket: Socket) => {
      this.onJoin(socket);

      socket.on("input", (msg: InputMsg) => this.onInput(socket, msg));
      socket.on("disconnect", () => this.onLeave(socket));
    });

    setInterval(() => this.tick(), 1000 / TICK_RATE);
  }

  private onJoin(socket: Socket) {
    const body = Bodies.rectangle(200, 200, 40, 40, {
      inertia: Infinity,
      label: socket.id,
    });
    const player = new Player(socket.id, body);

    this.world.addPlayer(player);
    socket.emit("hello", {
      id: socket.id,
      world: WORLD,
      map: WorldBuilder.worldMap,
    });

    console.log("join", socket.id);
  }

  private onInput(socket: Socket, msg: InputMsg) {
    const player = this.world.getPlayers().get(socket.id);
    if (!player) {
      return;
    }

    PlayerController.handleInput(player, msg);
  }

  private onLeave(socket: Socket) {
    this.world.removePlayer(socket.id);
    console.log("leave", socket.id);
  }

  private tick() {
    this.world.update();

    this.snapshotAccumulator += 1;

    const snapIntervalTicks = TICK_RATE / SNAPSHOT_RATE;

    if (this.snapshotAccumulator >= snapIntervalTicks) {
      this.snapshotAccumulator = 0;

      const snapshot = Array.from(this.world.getPlayers().values()).map(
        (p) => ({
          id: p.id,
          x: p.body.position.x,
          y: p.body.position.y,
          lastProcessedSeq: p.lastProcessedSeq,
        })
      );

      this.io.emit("state", {t: Date.now(), players: snapshot});
    }
  }
}
