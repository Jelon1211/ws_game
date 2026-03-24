import { Food as FoodSchema } from "../networking/schema/Food";
import { BaseEntity } from "./BaseEntity";
import Phaser from "phaser";

export class Food extends BaseEntity<FoodSchema> {
  private circle: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y, id);

    this.circle = scene.add.circle(0, 0, 5, 0xff0000);
    this.add(this.circle);
  }

  updateFromServer(data: FoodSchema): void {
    this.addSnapshot(data.x, data.y);
  }
}
