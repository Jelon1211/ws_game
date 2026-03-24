import Phaser from "phaser";

type Snapshot = {
  x: number;
  y: number;
  timestamp: number;
};

export abstract class BaseEntity<TState> extends Phaser.GameObjects.Container {
  private readonly id: string;

  private snapshots: Snapshot[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y);

    this.id = id;

    this.snapshots.push({
      x,
      y,
      timestamp: this.scene.time.now,
    });

    scene.add.existing(this);
  }

  abstract updateFromServer(data: TState): void;

  protected addSnapshot(x: number, y: number): void {
    this.snapshots.push({
      x,
      y,
      timestamp: this.scene.time.now,
    });

    const cutoff = this.scene.time.now - 1000;

    this.snapshots = this.snapshots.filter((s) => s.timestamp >= cutoff);
  }

  public getSnapshots(): Snapshot[] {
    return this.snapshots;
  }

  destroyEntity() {
    this.destroy();
  }
}
