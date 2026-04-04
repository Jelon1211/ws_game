export abstract class NetworkAction<TInput, TPayload = TInput> {
  protected lastSend: TInput | null = null;
  protected lastSendTime: number = 0;

  constructor(protected send: (data: TPayload) => void) {}

  protected shouldSend(data: TInput, now: number): boolean {
    return true;
  }

  protected buildMessage(data: TInput, now: number): TPayload {
    return data as unknown as TPayload;
  }

  protected afterSend(message: TPayload, data: TInput): void {}

  public update(data: TInput) {
    const now = performance.now();
    if (this.shouldSend(data, now)) {
      console.log("kiedy w action? ", data, now);
      const message = this.buildMessage(data, now);
      this.send(message);
      this.lastSend = structuredClone(data);
      this.lastSendTime = now;
    }
  }
}
