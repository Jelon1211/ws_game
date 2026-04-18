import type { Room } from "@colyseus/sdk";
import type { State } from "../schema/State";

export interface IRoomCallbackHandler {
  register(room: Room<State>): void;
}
