import {Engine, Events, Body} from "matter-js";
import {Player} from "../models/Player";

export class CollisionManager {
  private groundContacts = new Map<number, number>();

  constructor(
    private engine: Engine,
    private getPlayers: () => Iterable<Player>
  ) {
    this.registerCollisionEvents();
  }

  private registerCollisionEvents() {
    Events.on(this.engine, "collisionStart", (event) => {
      for (const pair of event.pairs) {
        this.handleCollision(pair.bodyA, pair.bodyB, true);
        this.handleCollision(pair.bodyB, pair.bodyA, true);
      }
    });

    Events.on(this.engine, "collisionEnd", (event) => {
      for (const pair of event.pairs) {
        this.handleCollision(pair.bodyA, pair.bodyB, false);
        this.handleCollision(pair.bodyB, pair.bodyA, false);
      }
    });
  }

  private handleCollision(a: Body, b: Body, started: boolean) {
    const player = Array.from(this.getPlayers()).find(
      (p) => p.body.id === a.id
    );
    if (!player) return;

    if (b.isStatic) {
      if (started) {
        this.incrementGround(player);
      } else {
        this.decrementGround(player);
      }
    }
  }

  private incrementGround(player: Player) {
    const id = player.body.id;
    const count = (this.groundContacts.get(id) ?? 0) + 1;
    this.groundContacts.set(id, count);

    if (count > 0) {
      player.onGround = true;
      player.lastGroundedTime = Date.now();
    }
  }

  private decrementGround(player: Player) {
    const id = player.body.id;
    const count = (this.groundContacts.get(id) ?? 0) - 1;
    this.groundContacts.set(id, Math.max(count, 0));

    if (count <= 0) {
      player.onGround = false;
    }
  }
}
