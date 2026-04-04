import { State } from "../../schema/State.js";
import { MsgTypes, RoomMessageMap } from "../../shared/types/Message.js";
import { IRoomHandler, OnMessageFn } from "../../core/RommHandlerRegister.js";

export class MoveHandler implements IRoomHandler {
  public register(state: State, onMessage: OnMessageFn): void {
    onMessage<RoomMessageMap[MsgTypes.Move]>(MsgTypes.Move, (client, data) => {
      const player = state.players.get(client.sessionId);
      if (!player) {
        return;
      }

      player.inputBuffer.push({ seq: data.seq, input: data.input });
      if (player.inputBuffer.length > 60) {
        player.inputBuffer.splice(0, player.inputBuffer.length - 60);
      }
    });
  }
}
