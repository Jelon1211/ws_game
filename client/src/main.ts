import Phaser from "phaser";
import { NetScene } from "./scenes/NetScene";
import { WORLD } from "./config";

new Phaser.Game({
  type: Phaser.AUTO,
  width: WORLD.w,
  height: WORLD.h,
  parent: "app",
  backgroundColor: "#0b1020",
  scene: [NetScene],
  render: { pixelArt: true },
});
