import { Room } from "colyseus";
import { MovementSystem } from "../features/movement/MovementSystem.js";
import { TimeSyncSystem } from "../features/tick/TimeSyncSystem.js";
import { SystemRegister } from "./SystemRegister.js";

export class SystemBuilder {
  static createDefault(room: Room, getTick: () => number): SystemRegister {
    const registry = new SystemRegister();

    registry.register(new TimeSyncSystem(room, getTick));
    registry.register(new MovementSystem());

    return registry;
  }
}
