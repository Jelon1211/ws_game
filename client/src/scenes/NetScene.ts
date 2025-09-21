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

export class NetScene extends Phaser.Scene {
  private me!: LocalAvatar;

  public mapRenderer!: MapRenderer;
  public net!: NetworkClient;
  public sync!: StateSync;

  public inputs = new InputController(this);
  public others = new Map<string, RemoteAvatar>();
  public world: WorldSize = {
    w: WORLD.w,
    h: WORLD.h,
  };

  preload() {
    this.load.spritesheet("chicken", "assets/Chicken_Sprite_Sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      "chickenRemote",
      "assets/Chicken_Sprite_Sheet_Black.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }

  create() {
    this.net = networkClient;
    networkClient.init();

    this.me = new LocalAvatar(this, "local-temp", 300, 300);
    this.cameras.main.startFollow(this.me, true, 0.15, 0.15);

    this.inputs.init();

    this.sync = new StateSync(this.me, this.others);

    registerHandlers(this);

    this.anims.create({
      key: "walk_local",
      frames: this.anims.generateFrameNumbers("chicken", { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "up_local",
      frames: this.anims.generateFrameNumbers("chicken", {
        start: 10,
        end: 12,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "walk_remote",
      frames: this.anims.generateFrameNumbers("chickenRemote", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "up_remote",
      frames: this.anims.generateFrameNumbers("chickenRemote", {
        start: 10,
        end: 12,
      }),
      frameRate: 8,
      repeat: 0,
    });
  }

  update(_time: number) {
    if (this.net && this.net.isConnected()) {
      this.inputs.maybeSend((msg) => this.net.sendInput(msg));
      this.me.predictMove(this.inputs.readCurrent());
    }

    for (const remote of this.others.values()) {
      remote.update();
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
