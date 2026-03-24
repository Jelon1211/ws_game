import { State } from "../schema/State.js";
import { MovementSystem } from "./MovementSystem.js";
import { CollisionSystem } from "./CollisionSystem.js";
import { FoodSystem } from "./FoodSystems.js";

export class GameLoop {
  static update(state: State, delta: number): void {
    MovementSystem.update(state, delta);
    CollisionSystem.update(state);
    FoodSystem.update(state);
  }
}
