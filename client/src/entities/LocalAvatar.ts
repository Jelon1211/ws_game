import { Avatar } from "./Avatar";

export class LocalAvatar extends Avatar {
  private speed = 120;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, 0x3366ff, 12);
  }

  // lokalna predykcja (aplikacja wejścia klienta)
  public predictMove(
    nx: number,
    ny: number,
    dt: number,
    world: { w: number; h: number }
  ) {
    this.x += nx * dt * this.speed;
    this.y += ny * dt * this.speed;
    this.clamp(world);
  }

  public setFromAuthoritative(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  private clamp(world: { w: number; h: number }) {
    this.x = Phaser.Math.Clamp(this.x, 0, world.w);
    this.y = Phaser.Math.Clamp(this.y, 0, world.h);
  }
}
