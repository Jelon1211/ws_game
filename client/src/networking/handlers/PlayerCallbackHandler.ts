import type { State } from "../schema/State";
import type { EntityManager } from "../../entities/EntityManager";
import type { StoreDispatcher } from "../../store/StoreDispatcher";
import { LocalPlayerEntity } from "../../entities/LocalPlayerEntity";
import Phaser from "phaser";
import type { Player } from "../schema/Player";
import { Callbacks, type Room } from "@colyseus/sdk";
import type { IRoomCallbackHandler } from "./IRoomCallbackHandler";

export class PlayerCallbackHandler implements IRoomCallbackHandler {
  constructor(
    private scene: Phaser.Scene,
    private entityManager: EntityManager,
    private storeDispatcher: StoreDispatcher,
    private getSessionId: () => string,
  ) {}

  register(room: Room<State>): void {
    const callbacks = Callbacks.get(room);

    callbacks.onAdd("players", (player: Player, sessionId: string) => {
      const localId = this.getSessionId();

      this.entityManager.createPlayer(
        this.scene,
        sessionId,
        localId,
        player.x,
        player.y,
      );

      const entity = this.entityManager.getPlayer(sessionId);
      if (!entity) {
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

    callbacks.onRemove("players", (_player: Player, sessionId: string) => {
      this.entityManager.removePlayer(sessionId);
    });
  }
}
