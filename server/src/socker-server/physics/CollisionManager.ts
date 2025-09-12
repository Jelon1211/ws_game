import {Engine, Events, Body} from "matter-js";
import {Player} from "../models/Player";

export class CollisionManager {
  constructor(
    private engine: Engine,
    private getPlayers: () => Iterable<Player>
  ) {
    this.registerCollisionEvents();
  }

  private registerCollisionEvents() {
    Events.on(this.engine, "collisionStart", (event) => {
      for (const pair of event.pairs) {
        [pair.bodyA, pair.bodyB].forEach((body) =>
          this.markPlayerGrounded(body)
        );
      }
    });

    Events.on(this.engine, "collisionEnd", (event) => {
      for (const pair of event.pairs) {
        [pair.bodyA, pair.bodyB].forEach((body) =>
          this.markPlayerAirborne(body)
        );
      }
    });
  }

  private markPlayerGrounded(body: Body) {
    const player = Array.from(this.getPlayers()).find(
      (p) => p.body.id === body.id
    );
    if (player) {
      player.onGround = true;
      player.lastGroundedTime = Date.now();
    }
  }

  private markPlayerAirborne(body: Body) {
    const player = Array.from(this.getPlayers()).find(
      (p) => p.body.id === body.id
    );
    if (player) {
      player.onGround = false;
    }
  }
}
