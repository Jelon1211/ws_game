import Phaser from "phaser";
import { Callbacks, type Client, type Room } from "@colyseus/sdk";
import type { State } from "../networking/schema/State";
import { Player } from "../networking/schema/Player";
import type { RoomMessageMap } from "../shared/types/Message";
import type { EntityManager } from "../entities/EntityManager";
import { LocalPlayerEntity } from "../entities/LocalPlayerEntity";

export class RoomHandler {
  private client: Client;
  private room: Room<State> | null = null;
  private entityManager: EntityManager;
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    client: Client,
    entityManager: EntityManager,
  ) {
    this.scene = scene;
    this.client = client;
    this.entityManager = entityManager;
  }

  public async joinOrCreateRoom(nickname: Player["nickname"]) {
    console.log("Joining room...");

    try {
      this.room = await this.client.joinOrCreate("my_room", {
        nickname,
      });

      this.setupCallbacks();
    } catch (e) {
      console.error("Room join error:", e);
    }
  }

  private setupCallbacks() {
    if (!this.room) {
      return;
    }

    const callbacks = Callbacks.get(this.room);

    callbacks.onAdd("players", (player, sessionId) => {
      const localId = this.room!.sessionId;

      this.entityManager.createPlayer(
        this.scene,
        sessionId,
        localId,
        player.x,
        player.y,
      );

      const entity = this.entityManager.getPlayer(sessionId);
      if (!entity) {
        console.warn("No entity found in RoomoHandler");
        return;
      }
      const isLocal = sessionId === localId;

      callbacks.onChange(player, () => {
        if (isLocal) {
          (entity as LocalPlayerEntity).reconcile(
            player.x,
            player.y,
            player.lastProcessedSeq,
          );
        } else {
          entity.setServerState(player.x, player.y);
        }
      });
    });

    callbacks.onRemove("players", (_player, sessionId) => {
      this.entityManager.removePlayer(sessionId);
    });
  }

  public async roomSend<T extends keyof RoomMessageMap>(
    msgType: T,
    payload: RoomMessageMap[T],
  ) {
    this.room?.send(msgType, payload);
  }

  public getRoom(): Room<State> | void {
    if (!this.room) {
      return console.warn("No room initalized");
    }
    return this.room;
  }
}
