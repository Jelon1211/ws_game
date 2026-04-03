import type { PlayerInitData } from "src/types/Player";
import type { PlayerEntity } from "./PlayerEntity";
import { LocalPlayerEntity } from "./LocalPlayerEntity";
import { RemotePlayerEntity } from "./RemotePlayerEntity ";

export class EntityManager {
  private players: Record<string, PlayerEntity> = {};
  private playerData: PlayerInitData;

  constructor(data: PlayerInitData) {
    this.playerData = data;
  }

  public createPlayer(
    scene: Phaser.Scene,
    sessionId: string,
    localId: string,
    x: number,
    y: number,
  ) {
    let entity: PlayerEntity;

    sessionId === localId
      ? (entity = new LocalPlayerEntity(scene, x, y, this.playerData))
      : (entity = new RemotePlayerEntity(scene, x, y, this.playerData));

    this.players[sessionId] = entity;
  }

  public removePlayer(sessionId: string) {
    const entity = this.players[sessionId];
    if (!entity) {
      return;
    }

    entity.destroy();
    delete this.players[sessionId];
  }

  public getPlayer(sessionId: string) {
    return this.players[sessionId];
  }

  update(delta: number, localId: string) {
    for (const id in this.players) {
      if (id === localId) {
        continue;
      }
      this.players[id]?.update(delta);
    }
  }
}
