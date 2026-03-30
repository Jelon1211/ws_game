import { MovementAction } from "./MovementAction";
import { MsgTypes } from "../../shared/types/Message";
import { NetworkActionManager, type ActionMap } from "./NetworkActionManager";
import type { RoomHandler } from "../RoomHandler";

export class NetworkActionFactory {
  static create(roomHandler: RoomHandler) {
    console.log(roomHandler);
    const manager = new NetworkActionManager<ActionMap>((type, payload) => {
      roomHandler.roomSend(type, payload);
    });

    manager.register(
      MsgTypes.Move,
      new MovementAction((input) => roomHandler.roomSend(MsgTypes.Move, input)),
    );

    return manager;
  }
}
