import {Server as IOServer} from "socket.io";
import {GameLoop} from "./GameLoop";

export class SocketServer {
  private io: IOServer;
  private gameLoop: GameLoop;

  constructor(httpServer: any) {
    this.io = new IOServer(httpServer, {cors: {origin: "*"}});
    this.gameLoop = new GameLoop(this.io);
  }

  public init() {
    this.gameLoop.start();
  }
}
