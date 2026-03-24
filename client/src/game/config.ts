import Phaser from "phaser";
import { GameScene } from "../scenes/GameScene";
import { BootScene } from "../scenes/BootScene";
import { UIScene } from "../scenes/UIScene";
import { MenuScene } from "../scenes/MenuScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#b6d53c",
  parent: "game-container",

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  pixelArt: true,

  scene: [BootScene, MenuScene, GameScene, UIScene],
};
