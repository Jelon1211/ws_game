import { State } from "../schema/State.js";
import { Player } from "../schema/Player.js";
import { GameConfig } from "../constants/GameConfig.js";

export class MovementSystem {
  static update(state: State, delta: number): void {
    const dt = delta / 1000;

    state.players.forEach((player) => {
      this.movePlayer(player, dt);
    });
  }

  private static movePlayer(player: Player, dt: number): void {}
}
