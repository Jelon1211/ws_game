import Phaser from "phaser";

export abstract class Avatar {
  readonly id: string;
  protected circle: Phaser.GameObjects.Arc;
  protected scene: Phaser.Scene;

  public get x() {
    return this.circle.x;
  }
  public get y() {
    return this.circle.y;
  }
  public set x(v: number) {
    this.circle.x = v;
  }
  public set y(v: number) {
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
