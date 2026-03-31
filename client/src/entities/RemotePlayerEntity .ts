import { PlayerEntity } from "./PlayerEntity";

export class RemotePlayerEntity extends PlayerEntity {
  public update(delta: number) {
    const lerp = Math.min(1, delta / 100);

    this.sprite.x = Phaser.Math.Linear(this.sprite.x, this.targetX, lerp);

    this.sprite.y = Phaser.Math.Linear(this.sprite.y, this.targetY, lerp);
  }
}
