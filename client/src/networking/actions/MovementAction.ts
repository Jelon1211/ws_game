import type { TInput } from "../../types/Inputs";
import { NetwrokAction } from "./NetworkAction";

export class MovementAction extends NetwrokAction<TInput> {
  private lastActiveTime = 0;

  protected shouldSend(data: TInput, now: number): boolean {
    const isMoving = data.left || data.right || data.up || data.down;

    const changed =
      !this.lastSend ||
      data.left !== this.lastSend.left ||
      data.right !== this.lastSend.right ||
      data.up !== this.lastSend.up ||
      data.down !== this.lastSend.down;

    if (isMoving) {
      this.lastActiveTime = now;
    }
    const idleTime = now - this.lastActiveTime;

    let heartbeatRate = 100;

    if (!isMoving) {
      if (idleTime > 3000) {
        heartbeatRate = 1000;
      } else {
        heartbeatRate = 250;
      }
    }

    const heartbeat = now - this.lastSendTime > heartbeatRate;

    return changed || heartbeat;
  }
}
