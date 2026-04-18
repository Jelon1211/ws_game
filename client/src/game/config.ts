import Phaser from "phaser";
import { GameScene } from "../scenes/GameScene";
import { BootScene } from "../scenes/BootScene";
import { GameConfig } from "../shared/configs/GameConfig";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.WORLD.WIDTH,
  height: GameConfig.WORLD.HEIGHT,
  backgroundColor: "#3b4221",
  parent: "game-container",

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  scale: {
    mode: Phaser.Scale.RESIZE,
  },

  pixelArt: true,

  fps: {
    target: GameConfig.GAME.FPS,
    forceSetTimeOut: true,
  },

  scene: [BootScene, GameScene],
};
