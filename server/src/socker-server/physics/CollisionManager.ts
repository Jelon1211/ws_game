// src/core/CollisionManager.ts
import {Engine, World, Bodies, Events, Body} from "matter-js";
import {WORLD} from "../constants";
import {Player} from "../models/Player";

export class CollisionManager {
  constructor(
    private engine: Engine,
    private getPlayers: () => Iterable<Player>
  ) {
    this.addGround();
    this.registerCollisionEvents();
  }

  private addGround() {
    const ground = Bodies.rectangle(WORLD.w / 2, WORLD.h, WORLD.w, 30, {
      isStatic: true,
      label: "ground",
    });
    World.add(this.engine.world, ground);
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
