import type { FoodState } from "../types";
import { BaseEntity } from "./BaseEntity";
import Phaser from "phaser";

export class Food extends BaseEntity<FoodState> {
  private circle: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y, id);

    this.circle = scene.add.circle(0, 0, 5, 0xff0000);
    this.add(this.circle);
  }

  updateFromServer(data: FoodState): void {
    this.setTargetPosition(data.x, data.y);
  }
}
