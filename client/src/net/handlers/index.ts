import { FromServerEventsEnum } from "../../enums/events";
import { handleHello } from "./handleHello";
import { handleState } from "./handleState";
import type { NetScene } from "../../scenes/NetScene";
import { networkClient } from "../NetworkClient";
import type { ServerHello, ServerState } from "../../types/server";

export function registerHandlers(scene: NetScene) {
  networkClient.on(FromServerEventsEnum.HELLO, (data: ServerHello) =>
    handleHello(scene, data)
  );
  networkClient.on(FromServerEventsEnum.STATE, (state: ServerState) =>
    handleState(scene, state)
  );
}
