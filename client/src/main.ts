import Phaser from "phaser";
import { NetScene } from "./scenes/NetScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: import.meta.env.VITE_SCENE_WIDTH,
  height: import.meta.env.VITE_SCENE_HEIGHT,
  parent: "app",
  backgroundColor: "#0b1020",
  scene: [NetScene],
  render: { pixelArt: true },
});
