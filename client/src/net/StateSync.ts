import { LocalAvatar, RemoteAvatar } from "../entities/Avatar";
import type { InputSample } from "../types/input";
import type { ServerPlayer } from "../types/server";

export class StateSync {
  constructor(
    private me: LocalAvatar,
    private others: Map<string, RemoteAvatar>
  ) {}

  // Rekonsyliacja własnej pozycji
  applySelfSnapshot(
    sp: ServerPlayer,
    pendingInputs: InputSample[],
    inputToVec: (i: InputSample) => { x: number; y: number },
    world: { w: number; h: number }
  ) {
    this.me.setFromAuthoritative(sp.x, sp.y);
    // odrzucamy przetworzone
    const remaining = pendingInputs.filter((i) => i.seq > sp.lastProcessedSeq);
    // odtwarzamy jeszcze nieprzetworzone
    for (const i of remaining) {
      const v = inputToVec(i);
      this.me.predictMove(v.x, v.y, i.dt, world);
    }
    return remaining; // zwraca zaktualizowaną listę pendingInputs
  }

  // Inni gracze – tworzenie i interpolacja
  applyRemoteSnapshot(players: ServerPlayer[]) {
    for (const sp of players) {
      if (this.others.has(sp.id)) {
        this.others.get(sp.id)!.lerpTo(sp.x, sp.y);
      }
    }
  }
}
