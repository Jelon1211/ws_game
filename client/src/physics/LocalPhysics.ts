import { Engine, World, Bodies, Body } from "matter-js";
import { SPEED } from "../config";

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

    this.body = Bodies.rectangle(startX, startY, 40, 40, {
      inertia: Infinity,
      label: "local",
    });

    World.add(this.engine.world, this.body);

    // opcjonalnie: lokalny ground
    const ground = Bodies.rectangle(450, 600, 900, 40, {
      isStatic: true,
      label: "ground",
    });
    World.add(this.engine.world, ground);
  }

  public step(input: { up?: boolean; left?: boolean; right?: boolean }) {
    let vx = 0;
    if (input.left) vx -= SPEED;
    if (input.right) vx += SPEED;

    Body.setVelocity(this.body, { x: vx, y: this.body.velocity.y });

    Engine.update(this.engine, 1000 / 60);
  }

  public get position() {
    return { x: this.body.position.x, y: this.body.position.y };
  }

  public setFromAuthoritative(x: number, y: number) {
    Body.setPosition(this.body, { x, y });
  }
}
