import type { ShootMessage, TShootInput } from "../../shared/types/Message";
import type { TickManager } from "../../systems/tick/TickManager";
import { NetworkAction } from "./NetworkAction";

export class ShootAction extends NetworkAction<TShootInput, ShootMessage> {
  private onSent?: (seq: number, intpu: TShootInput) => void;

  private shootCooldown: number = 1000 / 3;
  private seq: number = 0;

  constructor(
    send: (data: ShootMessage) => void,
    private tickManager: TickManager,
  ) {
    super(send);
  }

  public setOnSent(cb: (seq: number, input: TShootInput) => void): void {
    this.onSent = cb;
  }

  protected override buildMessage(
    data: TShootInput,
    now: number,
  ): ShootMessage {
    return {
      seq: this.seq++,
      tick: this.tickManager.getTick(),
      clientTime: now,
      shoot: {
        space: data.space,
      },
    };
  }

  protected override afterSend(message: ShootMessage, data: TShootInput): void {
    this.onSent?.(message.seq, data);
  }

  protected override shouldSend(data: TShootInput, now: number): boolean {
    if (!data.space) {
      return false;
    }
    if (this.lastSendTime === 0) {
      return true;
    }
    return now - this.lastSendTime >= this.shootCooldown;
  }
}
