import { InputSystem } from "./InputSystem";
import type { TMoveInput } from "../../types/Input";

export class MovementSystem extends InputSystem<TMoveInput> {
  poll(): TMoveInput {
    return {
      left: this.keys.left.isDown,
      right: this.keys.right.isDown,
      up: this.keys.up.isDown,
      down: this.keys.down.isDown,
    };
  }
}
