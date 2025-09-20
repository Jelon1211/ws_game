import { Avatar } from "./Avatar";

export class RemoteAvatar extends Avatar {
  private lastX: number;
  private lastY: number;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, "chickenRemote");

    this.lastX = x;
    this.lastY = y;
  }

  public applySnapshot(x: number, y: number) {
    const dx = x - this.lastX;
    const dy = y - this.lastY;

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

    this.x = x;
    this.y = y;

    this.lastX = x;
    this.lastY = y;
  }
}
