import {Server as IOServer} from "socket.io";
import {GameLoop} from "./GameLoop";
import {Server} from "http";
import {GameWorld} from "./GameWorld";

export class GameServer {
  private io: IOServer;
  private world: GameWorld = new GameWorld();
  private gameLoop: GameLoop;

  constructor(httpServer: Server) {
    this.io = new IOServer(httpServer, {cors: {origin: "*"}});
    this.gameLoop = new GameLoop(this.io, this.world);
  }

  public init() {
    this.gameLoop.start();
  }
}
