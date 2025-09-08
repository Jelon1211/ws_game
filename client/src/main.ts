import Phaser from "phaser";
import { NetScene } from "./scenes/NetScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  parent: "app",
  backgroundColor: "#0b1020",
  scene: [NetScene],
  render: { pixelArt: true },
});
