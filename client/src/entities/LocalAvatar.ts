import { Avatar } from "./Avatar";
import { LocalPhysics } from "../physics/LocalPhysics";

export class LocalAvatar extends Avatar {
  private physics: LocalPhysics;
  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y);
    this.physics = new LocalPhysics(scene, x, y);
  }

  public predictMove(input: {
    up?: boolean;
    left?: boolean;
    right?: boolean;
    down?: boolean;
  }) {
    this.physics.step(input);
    const pos = this.physics.position;
    this.x = pos.x;
    this.y = pos.y;

    switch (true) {
      case input.left:
        this.sprite.setFlipX(false);
        this.sprite.play("walk", true);
        break;

      case input.right:
        this.sprite.setFlipX(true);
        this.sprite.play("walk", true);
        break;

      case input.up:
        if (!this.sprite.anims.isPlaying) {
          this.sprite.setFlipX(false);
          this.sprite.play("up");
        }
        break;

      case input.down:
        this.sprite.setFlipX(false);
        this.sprite.play("down", true);
        break;

      default:
        this.sprite.stop();
    }
  }

  public setFromAuthoritative(x: number, y: number) {
    this.physics.setFromAuthoritative(x, y);
    this.x = x;
    this.y = y;
  }
}
