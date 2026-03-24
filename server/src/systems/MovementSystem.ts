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

  private static movePlayer(player: Player, dt: number): void {
    const dx = player.targetX - player.x;
    const dy = player.targetY - player.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1) {
      return;
    }

    const dirX = dx / distance;
    const dirY = dy / distance;

    const speed = this.getSpeed(player.mass);

    player.x += dirX * speed * dt;
    player.y += dirY * speed * dt;
  }

  private static getSpeed(mass: number): number {
    // return GameConfig.PLAYER.BASE_SPEED / Math.sqrt(mass);
    return GameConfig.PLAYER.BASE_SPEED;
  }
}
