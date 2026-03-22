import { Room, Callbacks } from "@colyseus/sdk";
import { colyseusClient } from "./ColyseusClient";
import type { FoodState, PlayerState } from "../types";
import { NetworkConstants } from "../constants/Network";

type EntityCallbacks<T> = {
  onAdd?: (entity: T, id: string) => void;
  onChange?: (entity: T, id: string) => void;
  onRemove?: (id: string) => void;
};

export class RoomHandler {
  private _room: Room | null = null;

  get room(): Room {
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

  listenCollection<T>(
    collectionName: string,
    callbacks: EntityCallbacks<T>,
  ): void {
    const cb = Callbacks.get(this.room);

    cb.onAdd(collectionName, (entity, id) => {
      callbacks.onAdd?.(entity as T, id as string);
    });

    cb.onChange(collectionName, (id, entity) => {
      callbacks.onChange?.(entity as T, id as string);
    });

    cb.onRemove(collectionName, (_, id) => {
      callbacks.onRemove?.(id as string);
    });
  }

  listenPlayers(callbacks: EntityCallbacks<PlayerState>): void {
    this.listenCollection<PlayerState>("players", callbacks);
  }

  listenFood(callbacks: EntityCallbacks<FoodState>): void {
    this.listenCollection<FoodState>("foods", callbacks);
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
