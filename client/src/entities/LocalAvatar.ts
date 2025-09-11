import { Avatar } from "./Avatar";

export class LocalAvatar extends Avatar {
  private speed = import.meta.env.VITE_AVATAR_SPEED as number;
  private gravity = import.meta.env.VITE_GRAVITY as number;
  private jumpSpeed = -import.meta.env.VITE_JUMP_SPEED as number;
  private velX = 0;
  private velY = 0;
  private onGround = false;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, 0x3366ff, 12);
  }

  public predictMove(
    nx: number,
    ny: number,
    dt: number,
    world: { w: number; h: number }
  ) {
    this.velX = nx * this.speed;

    if (ny < 0 && this.onGround) {
      this.velY = this.jumpSpeed;
      this.onGround = false;
    }

    this.velY += this.gravity * dt;

    this.x += this.velX * dt;
    this.y += this.velY * dt;

    this.x = Phaser.Math.Clamp(this.x, 0, world.w);

    if (this.y >= world.h) {
      this.y = world.h;
      this.velY = 0;
      this.onGround = true;
    }
  }

  public setFromAuthoritative(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
