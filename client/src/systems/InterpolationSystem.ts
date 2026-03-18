type Interpolatable = {
  x: number;
  y: number;
  setPosition(x: number, y: number): void;
};

type InterpolationConfig = {
  positionLerp: number;
};

export class InterpolationSystem {
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

  public interpolatePosition(
    entity: Interpolatable,
    targetX: number,
    targetY: number,
    delta: number,
  ): void {
    const alpha = this.computeAlpha(delta);

    const newX = this.lerp(entity.x, targetX, alpha);
    const newY = this.lerp(entity.y, targetY, alpha);

    entity.setPosition(newX, newY);
  }
}
