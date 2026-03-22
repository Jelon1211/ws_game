import { State } from "../schema/State";
import { MovementSystem } from "./MovementSystem";
import { CollisionSystem } from "./CollisionSystem";
import { FoodSystem } from "./FoodSystems";

export class GameLoop {
  static update(state: State, delta: number): void {
    MovementSystem.update(state, delta);
    CollisionSystem.update(state);
    FoodSystem.update(state);
  }
}
