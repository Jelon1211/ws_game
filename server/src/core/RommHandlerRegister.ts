import { Client } from "colyseus";
import { State } from "../schema/State.js";

export type OnMessageFn = <T>(
  type: string,
  cb: (client: Client, data: T) => void,
) => void;

export interface IRoomHandler {
  register(state: State, onMessage: OnMessageFn): void;
}

export class RoomHandlerRegister {
  private handlers: IRoomHandler[] = [];

  public register(handler: IRoomHandler): this {
    this.handlers.push(handler);
    return this;
  }

  public bindAll(state: State, onMessage: OnMessageFn): void {
    for (const handler of this.handlers) {
      handler.register(state, onMessage);
    }
  }
}
