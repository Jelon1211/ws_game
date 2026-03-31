import type { PlayerEntity } from "./PlayerEntity";

export class EntityManager {
  private players: Record<string, PlayerEntity> = {};

  public addPlayer(sessionId: string, entity: PlayerEntity) {
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
