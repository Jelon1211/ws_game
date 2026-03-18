import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";
import { assets } from "../assets/manifest";

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

  create(): void {
    console.log("✅ Assets loaded");

    this.scene.start(SceneKeys.Game);
    this.scene.launch(SceneKeys.UI);
  }

  private loadAssets(): void {
    assets.images.forEach((asset) => {
      this.load.image(asset.key, asset.url);
    });
  }
}
