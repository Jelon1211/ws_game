import { Client, Room, Callbacks } from "@colyseus/sdk";
import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  client = new Client("http://localhost:2567");
  room!: Room;

  playerEntities: { [sessionId: string]: any } = {};

  preload() {
    // preload scene
    this.load.image(
      "ship_0001",
      "https://cdn.jsdelivr.net/gh/colyseus/tutorial-phaser@master/client/dist/assets/ship_0001.png",
    );
  }

  async create() {
    console.log("Joining room...");

    try {
      this.room = await this.client.joinOrCreate("my_room");
      console.log("Joined successfully!");
    } catch (e) {
      console.error(e);
    }

    const callBacks = Callbacks.get(this.room);

    callBacks.onAdd("players", (player, sesstionId) => {
      console.log("kiedy to?", player);
    });
  }

  update(time: number, delta: number): void {
    // game loop
  }
}

// game config
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#b6d53c",
  parent: "phaser-example",
  physics: { default: "arcade" },
  pixelArt: true,
  scene: [GameScene],
};

// instantiate the game
const game = new Phaser.Game(config);
