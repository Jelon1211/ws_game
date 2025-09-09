import Phaser from "phaser";
import { NetworkClient } from "../net/NetworkClient";
import { InputController } from "../input/InputController";
import { StateSync } from "../net/StateSync";
import type { WorldSize } from "../types/world";
import type { ServerHello, ServerPlayer, ServerState } from "../types/server";
import { LocalAvatar } from "../entities/LocalAvatar";
import { RemoteAvatar } from "../entities/RemoteAvatar";

export class NetScene extends Phaser.Scene {
  private net = new NetworkClient();
  private inputs = new InputController(this);
  private me!: LocalAvatar;
  private others = new Map<string, RemoteAvatar>();
  private sync!: StateSync;

  private world: WorldSize = {
    w: import.meta.env.VITE_SCENE_WIDTH,
    h: import.meta.env.VITE_SCENE_HEIGHT,
  };

  create() {
    // 1) sieć
    this.net.connect("http://localhost:3000", this.onHello, this.onState);

    // 2) lokalny avatar (tymczasowo w 300,300 zanim dostaniemy hello/world)
    this.me = new LocalAvatar(this, "local-temp", 300, 300);
    this.cameras.main.startFollow(this.me as any, true, 0.15, 0.15);

    // 3) wejście
    this.inputs.init();

    // 4) synchronizacja
    this.sync = new StateSync(this.me, this.others);
  }

  private onHello = (data: ServerHello) => {
    this.world = data.world;
    this.cameras.main.setBounds(0, 0, this.world.w, this.world.h);
  };

  private onState = (state: ServerState) => {
    const myId = this.net.myId;
    // self + others
    for (const sp of state.players) {
      if (sp.id === myId) {
        // rekonsyliacja
        this.inputs.pending = this.sync.applySelfSnapshot(
          sp,
          this.inputs.pending,
          this.inputVector,
          this.world
        );
      } else {
        // ensure remote avatars
        if (!this.others.has(sp.id)) {
          this.others.set(sp.id, new RemoteAvatar(this, sp.id, sp.x, sp.y));
        }
      }
    }

    // usuń duchy
    const liveIds = new Set(state.players.map((p) => p.id));
    for (const id of Array.from(this.others.keys())) {
      if (!liveIds.has(id)) {
        this.others.get(id)?.destroy();
        this.others.delete(id);
      }
    }

    // interpolacja dla reszty
    const remotes: ServerPlayer[] = state.players.filter((p) => p.id !== myId);
    this.sync.applyRemoteSnapshot(remotes);
  };

  update(_time: number, deltaMs: number) {
    const dt = deltaMs / 1000;

    // 1) wejście → sieć (throttle)
    this.inputs.maybeSend((msg) => this.net.sendInput(msg));

    // 2) predykcja lokalna
    const v = this.inputVector(this.inputs.readCurrent());
    this.me.predictMove(v.x, v.y, dt, this.world);
  }

  private inputVector = (i: {
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
  }) => {
    let x = 0,
      y = 0;
    if (i.left) x -= 1;
    if (i.right) x += 1;
    if (i.up) y -= 1;
    if (i.down) y += 1;
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  };

  shutdown() {
    this.net.destroy();
    this.me?.destroy();
    for (const r of this.others.values()) {
      r.destroy();
    }
    this.others.clear();
  }
}
