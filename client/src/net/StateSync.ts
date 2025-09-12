// src/net/StateSync.ts
import type { LocalAvatar } from "../entities/LocalAvatar";
import type { RemoteAvatar } from "../entities/RemoteAvatar";
import type { InputSample } from "../types/input";
import type { ServerPlayer } from "../types/server";

export class StateSync {
  constructor(
    private me: LocalAvatar,
    private others: Map<string, RemoteAvatar>
  ) {}

  public applySelfSnapshot(sp: ServerPlayer, pendingInputs: InputSample[]) {
    this.me.setFromAuthoritative(sp.x, sp.y);

    // 2) zostaw tylko inputy, których serwer jeszcze nie przetworzył
    const remaining = pendingInputs.filter((i) => i.seq > sp.lastProcessedSeq);

    for (const i of remaining) {
      this.me.predictMove(i);
    }

    return remaining;
  }

  // Inni gracze – interpolacja
  public applyRemoteSnapshot(players: ServerPlayer[]) {
    for (const sp of players) {
      const other = this.others.get(sp.id);
      if (other) {
        other.lerpTo(sp.x, sp.y);
      }
    }
  }
}
