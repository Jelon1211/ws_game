import Phaser from "phaser";

export abstract class Avatar {
  readonly id: string;
  protected circle: Phaser.GameObjects.Arc;
  protected scene: Phaser.Scene;

  get x() {
    return this.circle.x;
  }
  get y() {
    return this.circle.y;
  }
  set x(v: number) {
    this.circle.x = v;
  }
  set y(v: number) {
    this.circle.y = v;
  }

  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    color: number,
    radius = 12
  ) {
    this.scene = scene;
    this.id = id;
    this.circle = scene.add.circle(x, y, radius, color);
  }

  destroy() {
    this.circle.destroy();
  }
}

export class LocalAvatar extends Avatar {
  speed = 120;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, 0x3366ff, 12);
  }

  // lokalna predykcja (aplikacja wejścia klienta)
  predictMove(
    nx: number,
    ny: number,
    dt: number,
    world: { w: number; h: number }
  ) {
    this.x += nx * dt * this.speed;
    this.y += ny * dt * this.speed;
    this.clamp(world);
  }

  setFromAuthoritative(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  private clamp(world: { w: number; h: number }) {
    this.x = Phaser.Math.Clamp(this.x, 0, world.w);
    this.y = Phaser.Math.Clamp(this.y, 0, world.h);
  }
}

export class RemoteAvatar extends Avatar {
  private activeTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, 0x999999, 10);
  }

  lerpTo(x: number, y: number, durationMs = 60) {
    this.activeTween?.remove();
    this.activeTween = this.scene.tweens.add({
      targets: this as any, // x/y getter/setter
      x,
      y,
      duration: durationMs,
      ease: "Linear",
    });
  }
}
