import Phaser from "phaser";
import { gameConfig } from "./config";
import type { PlayerInitData } from "../types/Player";
import { SceneKeys } from "../constants/SceneKeys";

export class Game extends Phaser.Game {
  constructor(playerData: PlayerInitData) {
    super(gameConfig);

    console.log("🚀 Game initialized");

    this.scene.start(SceneKeys.Boot, playerData);
  }
}
