import { State } from "../schema/State.js";
import { Player } from "../schema/Player.js";
import { GameConfig } from "../shared/configs/GameConfig.js";

export class MovementSystem {
  static update(state: State, delta: number): void {
    const speed = GameConfig.PLAYER.BASE_SPEED;
    state.players.forEach((player) => {
      const x = (player.right ? 1 : 0) - (player.left ? 1 : 0);
      const y = (player.up ? 1 : 0) - (player.down ? 1 : 0);

      const length = Math.hypot(x, y);

      if (length > 0) {
        const nx = x / length;
        const ny = y / length;

        player.x += nx * speed * (delta / 1000);
        player.y -= ny * speed * (delta / 1000);
      }
    });
  }

  private static movePlayer(player: Player, dt: number): void {}
}
