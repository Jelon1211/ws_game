import type { TInput } from "../shared/types/Message";
import { GameConfig } from "../shared/configs/GameConfig";
import { PlayerEntity } from "./PlayerEntity";

type PendingInput = { seq: number; input: TInput };

export class LocalPlayerEntity extends PlayerEntity {
  private speed = GameConfig.PLAYER.BASE_SPEED;
  private pendingInputs: PendingInput[] = [];

  public update(delta: number, input: TInput): void {
    this.applyInput(input, delta / 1000);
  }

  public onInputSent(seq: number, input: TInput): void {
    this.pendingInputs.push({ seq, input: { ...input } });
  }

  public reconcile(
    serverX: number,
    serverY: number,
    lastProcessedSeq: number,
  ): void {
    this.sprite.x = serverX;
    this.sprite.y = serverY;

    this.pendingInputs = this.pendingInputs.filter(
      (p) => p.seq > lastProcessedSeq,
    );

    const dt = GameConfig.GAME.TICK_RATE / 1000;
    for (const { input } of this.pendingInputs) {
      this.applyInput(input, dt);
    }
  }

  private applyInput(input: TInput, dt: number): void {
    const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      this.sprite.x += (dx / length) * this.speed * dt;
      this.sprite.y += (dy / length) * this.speed * dt;
    }
  }
}
