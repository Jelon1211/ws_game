// rooms/GameRoom.ts
import { Room, Client, AuthContext } from "@colyseus/core";
import { State } from "../schema/State.js";
import { GameLoop } from "../core/GameLoop.js";
import { GameConfig } from "../shared/configs/GameConfig.js";
import { SystemBuilder } from "../core/SystemBuilder.js";
import { SystemRegister } from "../core/SystemRegister.js";
import { RoomHandlerRegister } from "../core/RommHandlerRegister.js";
import { RommHandlerBuilder } from "../core/RommHandlerBuilder.js";
import { PlayerFactory } from "../features/player/PlayerFactory.js";
import { PlayerInitData } from "./types.js";

export class GameRoom extends Room {
  public override maxClients = 50;
  public override state = new State();

  private gameplayLoop: GameLoop;
  private systemRegistry: SystemRegister;
  private handlerRegistry: RoomHandlerRegister;

  public override onCreate(): void {
    console.log("🟢 GameRoom created");

    this.systemRegistry = SystemBuilder.createDefault();
    this.gameplayLoop = new GameLoop(this.systemRegistry);
    this.handlerRegistry = RommHandlerBuilder.createDefault();

    this.handlerRegistry.bindAll(this.state, this.onMessage.bind(this));
    this.setSimulationInterval(
      (delta) => this.gameplayLoop.update(this.state, delta),
      GameConfig.GAME.TICK_RATE,
    );
  }

  public override onJoin(client: Client, options: PlayerInitData): void {
    console.log(
      "➕ Player joined:",
      client.sessionId,
      " nickname: ",
      options.nickname,
    );
    this.state.players.set(
      client.sessionId,
      PlayerFactory.create(options.nickname),
    );
  }

  public override onAuth(
    client: Client,
    options: PlayerInitData,
    context: AuthContext,
  ): Boolean {
    const nicknameTaken = Array.from(this.state.players.values()).some(
      (player) => player.nickname === options.nickname,
    );
    if (nicknameTaken) {
      throw new Error("Nickname already taken");
    }
    return true;
  }

  public override onLeave(client: Client): void {
    console.log("❌ Player left:", client.sessionId);
    this.state.players.delete(client.sessionId);
  }

  public override onDispose(): void {
    console.log("🧹 Room disposed");
  }
}
