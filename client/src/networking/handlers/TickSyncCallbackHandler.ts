// networking/handlers/TickSyncCallbackHandler.ts

import type { Room } from "@colyseus/sdk";
import type { State } from "../schema/State";
import type { IRoomCallbackHandler } from "./IRoomCallbackHandler";
import type { TickManager } from "../../systems/tick/TickManager";

export class TickSyncCallbackHandler implements IRoomCallbackHandler {
  private hasSynced = false;

  constructor(private tickManager: TickManager) {}

  register(room: Room<State>): void {
    room.onMessage("tick_sync", (data: { serverTick: number }) => {
      if (!this.hasSynced) {
        this.tickManager.sync(data.serverTick);
        this.hasSynced = true;
      } else {
        this.tickManager.reconcile(data.serverTick);
      }
    });
  }
}
