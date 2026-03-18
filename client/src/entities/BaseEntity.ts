import Phaser from "phaser";

export abstract class BaseEntity<TState> extends Phaser.GameObjects.Container {
  private readonly id: string;

  protected targetX: number;
  protected targetY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y);

    this.id = id;
    this.targetX = x;
    this.targetY = y;

    scene.add.existing(this);
  }

  abstract updateFromServer(data: TState): void;

  setTargetPosition(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  getTargetPosition() {
    return {
      x: this.targetX,
      y: this.targetY,
    };
  }

  destroyEntity() {
    this.destroy();
  }
}
