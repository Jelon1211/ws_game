import Phaser from "phaser";
import { NetworkClient } from "../net/NetworkClient";
import { InputController } from "../input/InputController";
import { StateSync } from "../net/StateSync";
import type { WorldSize } from "../types/world";
import type { ServerHello, ServerPlayer, ServerState } from "../types/server";
import { LocalAvatar } from "../entities/LocalAvatar";
import { RemoteAvatar } from "../entities/RemoteAvatar";
import { WORLD } from "../config";
import { MapRenderer } from "../render/MapRenderer";

// TODO: this is not scene, move to some ws space

export class NetScene extends Phaser.Scene {
  private net = new NetworkClient();
  private inputs = new InputController(this);
  private me!: LocalAvatar;
  private others = new Map<string, RemoteAvatar>();
  private sync!: StateSync;
  private mapRenderer!: MapRenderer;

  private world: WorldSize = {
    w: WORLD.w,
    h: WORLD.h,
  };

  preload() {
    this.load.json("map01", "../../public/maps/01.json");
  }

  create() {
    this.net.connect(
      import.meta.env.VITE_SERVER_URL,
      this.onHello,
      this.onState
    );

    this.me = new LocalAvatar(this, "local-temp", 300, 300);
    this.cameras.main.startFollow(this.me as any, true, 0.15, 0.15);

    this.inputs.init();

    this.sync = new StateSync(this.me, this.others);

    // region render map
    this.mapRenderer = new MapRenderer(this);
    this.mapRenderer.render(this.cache.json.get("map01"));
    // endregion
  }

  update(_time: number) {
    this.inputs.maybeSend((msg) => this.net.sendInput(msg));
    this.me.predictMove(this.inputs.readCurrent());
  }

  shutdown() {
    this.net.destroy();
    this.me?.destroy();
    for (const r of this.others.values()) {
      r.destroy();
    }
    this.others.clear();
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
          this.inputs.pending
        );
      } else {
        if (!this.others.has(sp.id)) {
          this.others.set(sp.id, new RemoteAvatar(this, sp.id, sp.x, sp.y));
        }
      }
    }

    const liveIds = new Set(state.players.map((p) => p.id));
    for (const id of Array.from(this.others.keys())) {
      if (!liveIds.has(id)) {
        this.others.get(id)?.destroy();
        this.others.delete(id);
      }
    }

    const remotes: ServerPlayer[] = state.players.filter((p) => p.id !== myId);
    this.sync.applyRemoteSnapshot(remotes);
  };
}
