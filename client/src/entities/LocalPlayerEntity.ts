import { GameConfig } from "../shared/configs/GameConfig";
import { PlayerEntity } from "./PlayerEntity";
import type { PlayerInitData } from "../types/Player";
import type { TMoveInput } from "../types/Input";

type PendingInput = { seq: number; input: TMoveInput };

export class LocalPlayerEntity extends PlayerEntity {
  private speed = GameConfig.PLAYER.BASE_SPEED;
  private pendingInputs: PendingInput[] = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    options: PlayerInitData,
  ) {
    super(scene, x, y, options);
    this.sprite.setTint(Number(options.color.replace("#", "0x")));
  }

  public update(delta: number, input: TMoveInput): void {
    this.applyInput(input, delta / 1000);
  }

  public onInputSent(seq: number, input: TMoveInput): void {
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

  private applyInput(input: TMoveInput, dt: number): void {
    const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      this.sprite.x += (dx / length) * this.speed * dt;
      this.sprite.y += (dy / length) * this.speed * dt;
    }
  }
}
