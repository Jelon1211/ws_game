import { Room } from "@colyseus/core";
import { State } from "../../schema/State.js";

export class TimeSyncSystem {
  private elapsed = 0;
  private interval = 1000;

  constructor(
    private room: Room,
    private getTick: () => number,
  ) {}

  update(state: State, delta: number): void {
    this.elapsed += delta;

    if (this.elapsed >= this.interval) {
      this.elapsed = 0;

      this.room.broadcast("tick_sync", {
        serverTick: this.getTick(),
        serverTime: Date.now(),
      });
    }
  }
}
