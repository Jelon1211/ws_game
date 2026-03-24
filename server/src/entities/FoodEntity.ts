import { Food } from "../schema/Food.js";

export class FoodEntity {
  static setPosition(food: Food, x: number, y: number): void {
    food.x = x;
    food.y = y;
  }

  static distanceTo(food: Food, x: number, y: number): number {
    const dx = x - food.x;
    const dy = y - food.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
