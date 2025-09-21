// LocalAvatar.ts
import { Avatar } from "./Avatar";
import { LocalPhysics } from "../physics/LocalPhysics";
import { WORLD } from "../config";

export class LocalAvatar extends Avatar {
  private physics: LocalPhysics;
  private targetY: number;
  private readonly lerpY = 0.2; // możesz 0.15–0.3 dostroić

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, "chicken");
    this.physics = new LocalPhysics(scene, x, y);
    this.targetY = y;
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

    this.y += (this.targetY - this.y) * this.lerpY;

    const halfH = 20;
    if (this.y < halfH) this.y = halfH;
    if (this.y > WORLD.h - halfH) this.y = WORLD.h - halfH;

    this.physics.setY(this.y);

    switch (true) {
      case input.left:
        this.sprite.setFlipX(false);
        this.sprite.play("walk_local", true);
        break;

      case input.right:
        this.sprite.setFlipX(true);
        this.sprite.play("walk_local", true);
        break;

      case input.up:
        if (!this.sprite.anims.isPlaying) {
          this.sprite.setFlipX(false);
          this.sprite.play("up_local");
        }
        break;

      default:
        this.sprite.stop();
    }
  }

  public setFromAuthoritative(x: number, y: number) {
    this.physics.setFromAuthoritative(x, this.physics.position.y);
    this.x = this.physics.position.x;

    this.targetY = y;
  }
}
