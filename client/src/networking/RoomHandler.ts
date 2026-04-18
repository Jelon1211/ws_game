// networking/RoomHandler.ts
import Phaser from "phaser";
import { Callbacks, type Client, type Room } from "@colyseus/sdk";
import type { State } from "./schema/State";
import type { RoomMessageMap } from "../shared/types/Message";
import type { EntityManager } from "../entities/EntityManager";
import type { StoreDispatcher } from "../store/StoreDispatcher";
import type { PlayerInitData } from "../types/Player";
import { PlayerCallbackHandler } from "./handlers/PlayerCallbackHandler";
import type { IRoomCallbackHandler } from "./handlers/IRoomCallbackHandler";

export class RoomHandler {
  private room: Room<State> | null = null;
  private handlers: IRoomCallbackHandler[] = [];

  constructor(
    private scene: Phaser.Scene,
    private client: Client,
    private entityManager: EntityManager,
    private storeDispatcher: StoreDispatcher,
  ) {}

  public async joinOrCreateRoom(data: PlayerInitData) {
    try {
      this.room = await this.client.joinOrCreate("my_room", {
        nickname: data.nickname,
      });
      this.setupHandlers();
    } catch (e) {
      console.error("Room join error:", e);
    }
  }

  private setupHandlers() {
    if (!this.room) {
      return;
    }

    this.handlers = [
      new PlayerCallbackHandler(
        this.scene,
        this.entityManager,
        this.storeDispatcher,
        () => this.room!.sessionId,
      ),
    ];

    for (const handler of this.handlers) {
      handler.register(this.room);
    }
  }

  public async roomSend<T extends keyof RoomMessageMap>(
    msgType: T,
    payload: RoomMessageMap[T],
  ) {
    this.room?.send(msgType, payload);
  }

  public getRoom(): Room<State> | void {
    if (!this.room) return console.warn("No room initialized");
    return this.room;
  }
}
