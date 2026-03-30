export abstract class NetwrokAction<T> {
  protected lastSend: T | null = null;
  protected lastSendTime: number = 0;

  constructor(protected send: (data: T) => void) {}

  protected shouldSend(data: T, now: number): boolean {
    return true; // orverride
  }

  public update(data: T) {
    const now = performance.now();
    if (this.shouldSend(data, now)) {
      this.send(data);
      this.lastSend = structuredClone(data);
      this.lastSendTime = now;
    }
  }
}
