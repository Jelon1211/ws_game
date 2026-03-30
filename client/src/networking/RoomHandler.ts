import Phaser from "phaser";
import { Callbacks, type Client, type Room } from "@colyseus/sdk";
import type { State } from "../networking/schema/State";
import { Player } from "../networking/schema/Player";
import type { RoomMessageMap } from "../shared/types/Message";

export class RoomHandler {
  private client: Client;
  private room: Room<State> | null = null;
  private scene: Phaser.Scene;

  private playerEntities: {
    [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  } = {};

  constructor(client: Client, scene: Phaser.Scene) {
    this.client = client;
    this.scene = scene;
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
      const entity = this.scene.physics.add.image(
        player.x,
        player.y,
        "player_ship",
      );

      this.playerEntities[sessionId] = entity;

      callbacks.onChange(player, () => {
        console.log(player.x, player.y);
        entity.x = player.x;
        entity.y = player.y;
      });
    });

    callbacks.onRemove("players", (_player, sessionId) => {
      const entity = this.playerEntities[sessionId];

      if (entity) {
        entity.destroy();
        delete this.playerEntities[sessionId];
      }
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

  public getEntities(): {
    [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  } {
    return this.playerEntities;
  }
}
