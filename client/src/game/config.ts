import Phaser from "phaser";
import { GameScene } from "../scenes/GameScene";
import { BootScene } from "../scenes/BootScene";
import { UIScene } from "../scenes/UIScene";
import { MenuScene } from "../scenes/MenuScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#3b4221",
  parent: "game-container",

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  pixelArt: true,

  scene: [BootScene, MenuScene, GameScene, UIScene],
};
