import type { TInput } from "../types/Inputs";
import { GameConfig } from "../shared/configs/GameConfig";
import { PlayerEntity } from "./PlayerEntity";

export class LocalPlayerEntity extends PlayerEntity {
  private speed = GameConfig.PLAYER.BASE_SPEED;

  public update(delta: number, input: TInput) {
    const dt = delta / 1000;

    let vx = 0;
    let vy = 0;

    if (input.left) vx -= 1;
    if (input.right) vx += 1;
    if (input.up) vy -= 1;
    if (input.down) vy += 1;

    this.sprite.x += vx * this.speed * dt;
    this.sprite.y += vy * this.speed * dt;
  }

  public setServerState(x: number, y: number): void {
    // todo later
  }
}
