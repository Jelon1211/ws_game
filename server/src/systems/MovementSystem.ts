import { State } from "../schema/State.js";
import { GameConfig } from "../shared/configs/GameConfig.js";

export class MovementSystem {
  static update(state: State, delta: number): void {
    const dt = delta / 1000;
    const speed = GameConfig.PLAYER.BASE_SPEED;

    state.players.forEach((player) => {
      const inputs = player.inputBuffer.splice(0);

      for (const { seq, input } of inputs) {
        player.left = input.left;
        player.right = input.right;
        player.up = input.up;
        player.down = input.down;

        if (seq > player.lastProcessedSeq) {
          player.lastProcessedSeq = seq;
        }
      }

      const dx = (player.right ? 1 : 0) - (player.left ? 1 : 0);
      const dy = (player.up ? 1 : 0) - (player.down ? 1 : 0);

      const length = Math.hypot(dx, dy);

      if (length > 0) {
        const nx = dx / length;
        const ny = dy / length;

        player.x += nx * speed * dt;
        player.y -= ny * speed * dt;
      }

      player.x = Math.max(0, Math.min(GameConfig.WORLD.WIDTH, player.x));
      player.y = Math.max(0, Math.min(GameConfig.WORLD.HEIGHT, player.y));
    });
  }
}
