import { MovementSystem } from "../features/movement/MovementSystem.js";
import { SystemRegister } from "./SystemRegister.js";

export class SystemBuilder {
  static createDefault(): SystemRegister {
    const registry = new SystemRegister();

    registry.register(new MovementSystem());

    return registry;
  }
}
