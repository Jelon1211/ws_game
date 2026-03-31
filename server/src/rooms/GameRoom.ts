import { Room, Client } from "@colyseus/core";
import { State } from "../schema/State.js";
import { Player } from "../schema/Player.js";
import { GameLoop } from "../systems/GameLoop.js";
import { GameConfig } from "../shared/configs/GameConfig.js";
import { MsgTypes, RoomMessageMap } from "../shared/types/Message.js";

export class GameRoom extends Room {
  public override maxClients: number = 50;
  public override state = new State();

  public override onCreate(): void {
    console.log("🟢 GameRoom created");

    this.registerMessageHandlers();
    this.startGameLoop();
  }

  public override onJoin(
    client: Client,
    options: { nickname: Player["nickname"] },
  ): void {
    console.log("➕ Player joined:", client.sessionId);

    const player = new Player();
    player.x = Math.random() * GameConfig.WORLD.WIDTH;
    player.y = Math.random() * GameConfig.WORLD.HEIGHT;
    player.nickname = options.nickname;

    this.state.players.set(client.sessionId, player);
  }

  public override onLeave(client: Client): void {
    console.log("❌ Player left:", client.sessionId);
    this.state.players.delete(client.sessionId);
  }

  public override onDispose(): void {
    console.log("🧹 Room disposed");
  }

  private registerMessageHandlers(): void {
    this.onMessage(
      MsgTypes.Move,
      (client, data: RoomMessageMap[MsgTypes.Move]) => {
        const player = this.state.players.get(client.sessionId);
        if (!player) {
          return;
        }
        console.log("tutaj data kiedy i jaka: ", data);
        player.left = data.left;
        player.right = data.right;
        player.up = data.up;
        player.down = data.down;
      },
    );
  }

  private startGameLoop(): void {
    this.setSimulationInterval((deltaTime: number) => {
      this.updateRoom(deltaTime);
    }, GameConfig.GAME.TICK_RATE);
  }

  private updateRoom(deltaTime: number): void {
    GameLoop.update(this.state, deltaTime);
  }
}
