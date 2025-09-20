export abstract class Avatar {
  readonly id: string;
  protected sprite: Phaser.GameObjects.Sprite;
  protected scene: Phaser.Scene;

  public get x() {
    return this.sprite.x;
  }
  public get y() {
    return this.sprite.y;
  }
  public set x(v: number) {
    this.sprite.x = v;
  }
  public set y(v: number) {
    this.sprite.y = v;
  }

  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    spritesheet: string
  ) {
    this.scene = scene;
    this.id = id;
    this.sprite = scene.add.sprite(x, y, spritesheet);
  }

  destroy() {
    this.sprite.destroy();
  }
}
