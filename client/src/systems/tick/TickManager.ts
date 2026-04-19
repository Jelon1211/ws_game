export class TickManager {
  private accumulator: number = 0;
  private lastTime: number = performance.now();

  private localTick: number = 0;

  private tickOffset: number = 0;

  private readonly correctionFactor: number = 0.1;

  constructor(private readonly tickRate: number) {}

  public update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.accumulator += delta;

    while (this.accumulator >= this.tickRate) {
      this.localTick++;
      this.accumulator -= this.tickRate;
    }
  }

  public getLocalTick(): number {
    return this.localTick;
  }

  public getTick(): number {
    return this.localTick + this.tickOffset;
  }

  public sync(serverTick: number) {
    const estimatedLocal = this.localTick;
    this.tickOffset = serverTick - estimatedLocal;
  }

  public reconcile(serverTick: number) {
    const estimated = this.getTick();
    const diff = serverTick - estimated;

    if (Math.abs(diff) > 10) {
      this.tickOffset += diff;
      return;
    }

    this.tickOffset += diff * this.correctionFactor;
  }
}
