import type { TShootInput } from "../../types/Input";
import { InputSystem } from "./InputSystem";

export class ShootSystem extends InputSystem<TShootInput> {
  poll(): TShootInput {
    return { space: this.keys.space.isDown };
  }
}
