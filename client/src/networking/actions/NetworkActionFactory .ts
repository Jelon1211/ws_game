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
import type { TickManager } from "../../systems/tick/TickManager";

export type ActionMap = {
  [MsgTypes.Move]: INetworkAction<TMoveInput>;
  [MsgTypes.Shoot]: INetworkAction<TShootInput>;
};

export class NetworkActionFactory {
  static create(roomHandler: RoomHandler, tickManager: TickManager) {
    const manager = new NetworkActionManager<ActionMap>((type, payload) => {
      roomHandler.roomSend(type, payload);
    });

    manager.register(
      MsgTypes.Move,
      new MovementAction(
        (moveMessage) => roomHandler.roomSend(MsgTypes.Move, moveMessage),
        tickManager,
      ),
    );
    manager.register(
      MsgTypes.Shoot,
      new ShootAction(
        (shootMessage) => roomHandler.roomSend(MsgTypes.Shoot, shootMessage),
        tickManager,
      ),
    );

    return manager;
  }
}
