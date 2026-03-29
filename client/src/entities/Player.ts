import Phaser from "phaser";
import { BaseEntity } from "./BaseEntity";
import type { Player as PlayerSchema } from "../networking/schema/Player";

export class Player extends BaseEntity<PlayerSchema> {
  private readonly bodyCircle: Phaser.GameObjects.Arc;

  private targetX: number;
  private targetY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y, id);

    this.targetX = x;
    this.targetY = y;

    this.bodyCircle = scene.add.circle(0, 0, 6, 0x00ff00);
    this.add(this.bodyCircle);
  }

  updateFromServer(data: PlayerSchema): void {
    this.targetX = data.x;
    this.targetY = data.y;
  }
}
