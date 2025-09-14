import Phaser from "phaser";
import { networkClient, NetworkClient } from "../net/NetworkClient";
import { InputController } from "../input/InputController";
import { StateSync } from "../net/StateSync";
import type { WorldSize } from "../types/world";
import { LocalAvatar } from "../entities/LocalAvatar";
import { RemoteAvatar } from "../entities/RemoteAvatar";
import { WORLD } from "../config";
import { MapRenderer } from "../render/MapRenderer";
import { registerHandlers } from "../net/handlers";
import type { IMap } from "../types/map";

export class NetScene extends Phaser.Scene {
  private me!: LocalAvatar;
  private mapRenderer!: MapRenderer;

  public net!: NetworkClient;
  public sync!: StateSync;
  public map!: IMap;

  public inputs = new InputController(this);
  public others = new Map<string, RemoteAvatar>();
  public world: WorldSize = {
    w: WORLD.w,
    h: WORLD.h,
  };

  preload() {
    this.load.json("map01", "../../public/maps/01.json");
  }

  create() {
    this.net = networkClient;
    networkClient.init();

    this.me = new LocalAvatar(this, "local-temp", 300, 300);
    this.cameras.main.startFollow(this.me as any, true, 0.15, 0.15);

    this.inputs.init();

    this.sync = new StateSync(this.me, this.others);

    registerHandlers(this);

    // region render map
    this.mapRenderer = new MapRenderer(this);
    this.mapRenderer.render(this.cache.json.get("map01"));
    // endregion
  }

  update(_time: number) {
    if (this.net && this.net.isConnected()) {
      this.inputs.maybeSend((msg) => this.net.sendInput(msg));
      this.me.predictMove(this.inputs.readCurrent());
    }
  }

  shutdown() {
    this.net.destroy();
    this.me?.destroy();
    for (const r of this.others.values()) {
      r.destroy();
    }
    this.others.clear();
  }
}
