import Phaser from "phaser";
import { NetScene } from "./scenes/NetScene";
import { WORLD } from "./config";
import "./style.css";

new Phaser.Game({
  type: Phaser.AUTO,
  width: WORLD.w,
  height: WORLD.h,
  parent: "app",
  backgroundColor: "#0b1020",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [NetScene],
  render: { pixelArt: true },
  scale: {
    mode: Phaser.Scale.FIT, // dopasuje grę do okna
  },
});
