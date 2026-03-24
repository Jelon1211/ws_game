type Interpolatable = {
  x: number;
  y: number;
  setPosition(x: number, y: number): void;
};

type InterpolationConfig = {
  positionLerp: number;
};

export class InterpolationSystem {
  private readonly renderDelay = 150;
  private readonly config: InterpolationConfig = {
    positionLerp: 10,
  };

  private lerp(current: number, target: number, alpha: number): number {
    return current + (target - current) * alpha;
  }

  private computeAlpha(delta: number): number {
    const dt = delta / 1000;

    return 1 - Math.exp(-this.config.positionLerp * dt);
  }

  public interpolate(entity: any): void {
    const snapshots = entity.getSnapshots();

    if (!snapshots || snapshots.length < 2) {
      return;
    }
    const now = entity.scene.time.now;
    const renderTime = now - this.renderDelay;

    let i = 0;

    while (
      i < snapshots.length - 1 &&
      snapshots[i + 1].timestamp <= renderTime
    ) {
      i++;
    }

    const s1 = snapshots[i];
    const s2 = snapshots[i + 1];

    if (!s2) {
      entity.setPosition(s1.x, s1.y);
      return;
    }

    if (!s1 || !s2) {
      return;
    }

    const rawT = (renderTime - s1.timestamp) / (s2.timestamp - s1.timestamp);

    const t = Phaser.Math.Clamp(rawT, 0, 1);

    const x = Phaser.Math.Linear(s1.x, s2.x, t);
    const y = Phaser.Math.Linear(s1.y, s2.y, t);

    entity.setPosition(x, y);
  }
}
