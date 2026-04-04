import type { TShootInput } from "../../shared/types/Message";
import { InputSystem } from "./InputSystem";

export class ShootSystem extends InputSystem<TShootInput> {
  poll(): TShootInput {
    return { space: this.keys.space.isDown };
  }
}
