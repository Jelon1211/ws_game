import {Server as IOServer} from "socket.io";
import {GameLoop} from "./GameLoop";
import {Server} from "http";

export class SocketServer {
  private io: IOServer;
  private gameLoop: GameLoop;

  constructor(httpServer: Server) {
    this.io = new IOServer(httpServer, {cors: {origin: "*"}});
    this.gameLoop = new GameLoop(this.io);
  }

  public init() {
    this.gameLoop.start();
  }
}
