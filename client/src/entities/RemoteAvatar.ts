import { Avatar } from "./Avatar";

export class RemoteAvatar extends Avatar {
  private targetX: number;
  private targetY: number;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, "chickenRemote");

    this.targetX = x;
    this.targetY = y;
  }

  public applySnapshot(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  public update() {
    const lerpFactor = 0.2; // smoothing

    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    // some magic maths
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.sprite.setFlipX(dx > 0);
        this.sprite.play("walk_remote", true);
      } else if (dy < 0) {
        this.sprite.setFlipX(false);
        this.sprite.play("up_remote", true);
      }
    } else {
      this.sprite.stop();
    }
  }
}
