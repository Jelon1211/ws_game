import { MoveHandler } from "../rooms/handlers/MoveHandler.js";
import { RoomHandlerRegister } from "./RommHandlerRegister.js";

export class RommHandlerBuilder {
  static createDefault(): RoomHandlerRegister {
    const registry = new RoomHandlerRegister();

    registry.register(new MoveHandler());

    return registry;
  }
}
