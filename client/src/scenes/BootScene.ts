import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";
import { assets } from "../assets/manifest";
import type { PlayerInitData } from "../types/Player";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  preload(): void {
    this.loadAssets();

    this.load.on("progress", (value: number) => {
      console.log(`Loading: ${Math.floor(value * 100)}%`);
    });
  }

  create(playerData: PlayerInitData): void {
    console.log("✅ Assets loaded");

    this.scene.start(SceneKeys.Game, playerData);
  }

  private loadAssets(): void {
    assets.images.forEach((asset) => {
      this.load.image(asset.key, asset.url);
    });
  }
}
