import {Room, Client} from "colyseus";
import {Schema, type, MapSchema} from "@colyseus/schema";

class Player extends Schema {
  @type("number") x = 0;
  @type("number") y = 0;
}

class State extends Schema {
  @type({map: Player}) players = new MapSchema<Player>();
}

export class MyRoom extends Room<State> {
  onCreate() {
    this.setState(new State());
  }

  onJoin(client: Client) {
    const player = new Player();
    this.state.players.set(client.sessionId, player);
  }

  onMessage(client: Client, message: any) {
    if (message.type === "move") {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = message.x;
        player.y = message.y;
      }
    }
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
  }
}
