import { State } from "../schema/State.js";
import { Food } from "../schema/Food.js";
import { generateId } from "colyseus";

const MAX_FOOD = 200;
const MAP_SIZE = 2000;

export class FoodSystem {
  static update(state: State): void {
    const currentFood = state.foods.size;

    if (currentFood >= MAX_FOOD) {
      return;
    }

    const toSpawn = MAX_FOOD - currentFood;

    for (let i = 0; i < toSpawn; i++) {
      this.spawnFood(state);
    }
  }

  private static spawnFood(state: State): void {
    const food = new Food();

    food.x = Math.random() * MAP_SIZE;
    food.y = Math.random() * MAP_SIZE;

    const id = generateId();

    state.foods.set(id, food);
  }
}
