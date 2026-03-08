import http from "http";
import express from "express";
import { Server } from "colyseus";
import { Room } from "colyseus";

const port = 2567;

class BattleRoom extends Room {
  onCreate() {
    console.log("Battle room created");

    this.onMessage("attack", (client, message) => {
      console.log(client.sessionId, "attacks", message);
    });
  }
}

const app = express();
const server = http.createServer(app);

const gameServer = new Server({
  server,
});

gameServer.define("battle", BattleRoom);

server.listen(port, () => {
  console.log("Server running on", port);
});
