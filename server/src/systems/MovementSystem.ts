import { State } from "../schema/State.js";
import { GameConfig } from "../shared/configs/GameConfig.js";

// systems/MovementSystem.ts
export class MovementSystem {
  static update(state: State, delta: number): void {
    const speed = GameConfig.PLAYER.BASE_SPEED;

    state.players.forEach((player) => {
      const inputs = player.inputBuffer.splice(0);

      for (const { seq, input } of inputs) {
        const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
        const dy = (input.up ? 1 : 0) - (input.down ? 1 : 0);

        const length = Math.hypot(dx, dy);
        if (length > 0) {
          player.x += (dx / length) * speed * (delta / 1000);
          player.y -= (dy / length) * speed * (delta / 1000);
        }

        if (seq > player.lastProcessedSeq) {
          player.lastProcessedSeq = seq;
        }
      }

      player.x = Math.max(0, Math.min(GameConfig.WORLD.WIDTH, player.x));
      player.y = Math.max(0, Math.min(GameConfig.WORLD.HEIGHT, player.y));
    });
  }
}
