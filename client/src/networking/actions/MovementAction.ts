import type { MoveMessage, TMoveInput } from "../../shared/types/Message";
import type { TickManager } from "../../systems/tick/TickManager";
import { NetworkAction } from "./NetworkAction";

export class MovementAction extends NetworkAction<TMoveInput, MoveMessage> {
  private seq = 0;
  private onSent?: (seq: number, intpu: TMoveInput) => void;

  constructor(
    send: (data: MoveMessage) => void,
    private tickManager: TickManager,
  ) {
    super(send);
  }

  public setOnSent(cb: (seq: number, input: TMoveInput) => void): void {
    this.onSent = cb;
  }

  protected override buildMessage(data: TMoveInput, now: number): MoveMessage {
    return {
      seq: this.seq++,
      tick: this.tickManager.getTick(),
      clientTime: now,
      input: { ...data },
    };
  }

  protected override afterSend(message: MoveMessage, data: TMoveInput): void {
    this.onSent?.(message.seq, data);
  }

  protected override shouldSend(data: TMoveInput, now: number): boolean {
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
