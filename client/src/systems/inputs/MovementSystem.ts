import type { TMoveInput } from "../../shared/types/Message";
import { InputSystem } from "./InputSystem";

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
