import { Engine, World, Bodies, Body } from "matter-js";
import { SPEED, WORLD } from "../config";

// TODO: move game wolrd to different space - this is should be only phisics

export class LocalPhysics {
  private engine: Engine;
  private body: Body;

  constructor(startX: number, startY: number) {
    this.engine = Engine.create({
      gravity: {
        x: 0,
        // y: GRAVITY / 1000 - DISABLED CLIENT GRAVITY
        y: 0,
      },
    });

    // This is not phisics
    this.body = Bodies.rectangle(startX, startY, 40, 40, {
      inertia: Infinity,
      label: "local",
    });

    World.add(this.engine.world, this.body);
  }

  public step(input: { up?: boolean; left?: boolean; right?: boolean }) {
    let vx = 0;
    if (input.left) vx -= SPEED;
    if (input.right) vx += SPEED;

    Body.setVelocity(this.body, { x: vx, y: this.body.velocity.y });

    Engine.update(this.engine, 1000 / 60);

    const halfW = 20; // half the player TODO: do it better
    const halfH = 20; // half the player TODO: do it better

    let x = this.body.position.x;
    let y = this.body.position.y;

    if (x < halfW) {
      x = halfW;
    }
    if (x > WORLD.w - halfW) {
      x = WORLD.w - halfW;
    }
    if (y < halfH) {
      y = halfH;
    }
    if (y > WORLD.h - halfH) {
      y = WORLD.h - halfH;
    }

    Body.setPosition(this.body, { x, y });
  }

  public get position() {
    return { x: this.body.position.x, y: this.body.position.y };
  }

  public setFromAuthoritative(x: number, y: number) {
    Body.setPosition(this.body, { x, y });
  }
}
