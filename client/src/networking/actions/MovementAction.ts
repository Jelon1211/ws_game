import type { MoveMessage, TInput } from "../../shared/types/Message";
import { NetworkAction } from "./NetworkAction";

export class MovementAction extends NetworkAction<TInput, MoveMessage> {
  private seq = 0;

  protected buildMessage(data: TInput, now: number): MoveMessage {
    return {
      seq: this.seq++,
      clientTime: now,
      input: { ...data },
    };
  }

  protected shouldSend(data: TInput, now: number): boolean {
    const changed =
      !this.lastSend ||
      data.left !== this.lastSend.left ||
      data.right !== this.lastSend.right ||
      data.up !== this.lastSend.up ||
      data.down !== this.lastSend.down;

    const heartbeat = now - this.lastSendTime > 100;

    return changed || heartbeat;
  }
}
