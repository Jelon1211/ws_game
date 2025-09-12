import {Engine, World, Bodies, Events, Body} from "matter-js";
import {WORLD} from "../constants";
import {Player} from "../models/Player";

export class CollisionManager {
  constructor(
    private engine: Engine,
    private getPlayers: () => Iterable<Player>
  ) {
    this.addWalls();
    this.registerCollisionEvents();
  }

  private addWalls() {
    const thickness = 30; // grubość ścian
    const w = WORLD.w;
    const h = WORLD.h;

    const ground = Bodies.rectangle(w / 2, h + thickness / 2, w, thickness, {
      isStatic: true,
      label: "ground",
    });

    const ceiling = Bodies.rectangle(w / 2, -thickness / 2, w, thickness, {
      isStatic: true,
      label: "ceiling",
    });

    const leftWall = Bodies.rectangle(-thickness / 2, h / 2, thickness, h, {
      isStatic: true,
      label: "leftWall",
    });

    const rightWall = Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, {
      isStatic: true,
      label: "rightWall",
    });

    World.add(this.engine.world, [ground, ceiling, leftWall, rightWall]);
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
