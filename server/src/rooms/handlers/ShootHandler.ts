import { State } from "../../schema/State.js";
import { MsgTypes, RoomMessageMap } from "../../shared/types/Message.js";
import { IRoomHandler, OnMessageFn } from "../../core/RommHandlerRegister.js";

export class ShootHandler implements IRoomHandler {
  public register(state: State, onMessage: OnMessageFn): void {
    onMessage<RoomMessageMap[MsgTypes.Shoot]>(
      MsgTypes.Shoot,
      (client, data) => {
        const player = state.players.get(client.sessionId);
        if (!player) {
          return;
        }

        console.log("Shoot message odebrany -> ", data);
      },
    );
  }
}
