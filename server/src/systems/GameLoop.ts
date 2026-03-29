import { State } from "../schema/State.js";
import { MovementSystem } from "./MovementSystem.js";

export class GameLoop {
  static update(state: State, delta: number): void {
    MovementSystem.update(state, delta);
  }
}
