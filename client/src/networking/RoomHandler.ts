import { Room, Callbacks } from "@colyseus/sdk";
import { colyseusClient } from "./ColyseusClient";
import { NetworkConstants } from "../constants/Network";
import type { State } from "./schema/State";
import type { Player } from "./schema/Player";
import type { Food } from "./schema/Food";

type EntityCallbacks<T> = {
  onAdd?: (entity: T, id: string) => void;
  onChange?: (entity: T, id: string) => void;
  onRemove?: (id: string) => void;
};

enum CollectionNameEnum {
  PLAYERS = "players",
  FOODS = "foods",
}

export class RoomHandler {
  private _room: Room<State> | null = null;

  get room(): Room<State> {
    if (!this._room) {
      throw new Error("Room not initialized. Call join() first.");
    }
    return this._room;
  }

  get sessionId(): string {
    return this.room.sessionId;
  }

  async join(roomName: string = NetworkConstants.mainRoom): Promise<void> {
    console.log("🌐 Connecting to server...");

    this._room = await colyseusClient.getClient().joinOrCreate(roomName);

    console.log("✅ Connected:", this._room.sessionId);
  }

  listenCollection<T extends object>(
    collectionName: CollectionNameEnum,
    callbacks: EntityCallbacks<T>,
  ): void {
    const cb = Callbacks.get(this.room);

    cb.onAdd(collectionName, (entity, key) => {
      const id = String(key);
      const typedEntity = entity as T;

      callbacks.onAdd?.(typedEntity, id);

      cb.onChange(entity, () => {
        callbacks.onChange?.(typedEntity, id);
      });
    });

    cb.onRemove(collectionName, (_, key) => {
      const id = String(key);
      callbacks.onRemove?.(id);
    });
  }

  listenPlayers(callbacks: EntityCallbacks<Player>): void {
    this.listenCollection<Player>(CollectionNameEnum.PLAYERS, callbacks);
  }

  listenFood(callbacks: EntityCallbacks<Food>): void {
    this.listenCollection<Food>(CollectionNameEnum.FOODS, callbacks);
  }

  sendInput(target: { x: number; y: number }): void {
    this.room.send("move", target);
  }

  onMessage<T>(type: string, callback: (message: T) => void): void {
    this.room.onMessage(type, callback);
  }

  leave(): void {
    this._room?.leave();
    this._room = null;
  }
}
