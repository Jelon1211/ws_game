import { MovementAction } from "./MovementAction";
import {
  MsgTypes,
  type TMoveInput,
  type TShootInput,
} from "../../shared/types/Message";
import { NetworkActionManager } from "./NetworkActionManager";
import type { RoomHandler } from "../RoomHandler";
import { ShootAction } from "./ShootAction";
import type { INetworkAction } from "../../types/Network";

export type ActionMap = {
  [MsgTypes.Move]: INetworkAction<TMoveInput>;
  [MsgTypes.Shoot]: INetworkAction<TShootInput>;
};

export class NetworkActionFactory {
  static create(roomHandler: RoomHandler) {
    const manager = new NetworkActionManager<ActionMap>((type, payload) => {
      roomHandler.roomSend(type, payload);
    });

    manager.register(
      MsgTypes.Move,
      new MovementAction((moveMessage) =>
        roomHandler.roomSend(MsgTypes.Move, moveMessage),
      ),
    );
    manager.register(
      MsgTypes.Shoot,
      new ShootAction((shootMessage) =>
        roomHandler.roomSend(MsgTypes.Shoot, shootMessage),
      ),
    );

    return manager;
  }
}
