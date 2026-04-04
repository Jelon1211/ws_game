import type { ShootMessage, TShootInput } from "../../shared/types/Message";
import { NetworkAction } from "./NetworkAction";

export class ShootAction extends NetworkAction<TShootInput, ShootMessage> {
  private shootCooldown: number = 1000 / 3;

  private onSent?: (intpu: TShootInput) => void;

  public setOnSent(cb: (input: TShootInput) => void): void {
    this.onSent = cb;
  }

  protected override buildMessage(
    data: TShootInput,
    now: number,
  ): ShootMessage {
    return {
      shoot: {
        space: data.space,
      },
    };
  }

  protected override afterSend(message: ShootMessage, data: TShootInput): void {
    this.onSent?.(data);
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
