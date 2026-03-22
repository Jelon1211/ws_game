import { Room, Client } from "@colyseus/core";
import { State } from "../schema/State";
import { Player } from "../schema/Player";
import type { MoveInput } from "../types/Input";
import { GameLoop } from "../systems/GameLoop";
import { GameConfig } from "../constants/GameConfig";

export class GameRoom extends Room {
  public override maxClients: number = 50;
  public override state = new State();

  public override onCreate(): void {
    console.log("🟢 GameRoom created");

    this.registerMessageHandlers();
    this.startGameLoop();
  }

  public override onJoin(client: Client): void {
    console.log("➕ Player joined:", client.sessionId);

    const player = new Player();
    player.x = Math.random() * GameConfig.WORLD.WIDTH;
    player.y = Math.random() * GameConfig.WORLD.HEIGHT;
    player.targetX = player.x;
    player.targetY = player.y;
    player.mass = GameConfig.PLAYER.START_MASS;

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
    this.onMessage("move", (client, data: MoveInput) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) {
        return;
      }

      player.targetX = data.x;
      player.targetY = data.y;
    });
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
