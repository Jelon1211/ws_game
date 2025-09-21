// LocalPhysics.ts (KLIENT)
import { Engine, World, Bodies, Body } from "matter-js";
import { SPEED, WORLD } from "../config";
import { PhysicsEngine } from "./PhysicsEngine";

export class LocalPhysics {
  private physicsEnginge: PhysicsEngine = PhysicsEngine.getInstance();
  private engine: Engine;
  private body: Body;

  constructor(_scene: Phaser.Scene, startX: number, startY: number) {
    this.engine = this.physicsEnginge.getEngine();

    this.body = Bodies.rectangle(startX, startY, 40, 40, {
      inertia: Infinity,
      label: "localAvatar",
    });
    World.add(this.physicsEnginge.getWorld(), this.body);
  }

  public step(input: { up?: boolean; left?: boolean; right?: boolean }) {
    // --- X jak dotychczas ---
    let vx = 0;
    if (input.left) vx -= SPEED;
    if (input.right) vx += SPEED;

    Body.setVelocity(this.body, { x: vx, y: this.body.velocity.y });

    // stały krok (jak serwer)
    Engine.update(this.engine, 1000 / 60);

    // clamp TYLKO X; Y zostawiamy dla lerpa
    const halfW = 20;
    let x = this.body.position.x;
    if (x < halfW) x = halfW;
    if (x > WORLD.w - halfW) x = WORLD.w - halfW;

    Body.setPosition(this.body, { x, y: this.body.position.y });
  }

  public get position() {
    return { x: this.body.position.x, y: this.body.position.y };
  }

  // używane do natychmiastowej korekty X (Y zostaje jak było)
  public setFromAuthoritative(x: number, y: number) {
    Body.setPosition(this.body, { x, y }); // nadal zostawiamy – użyjemy sprytnie w LocalAvatar
  }

  // nowość: kontrola Y z zewnątrz (po lerpie)
  public setY(y: number) {
    Body.setPosition(this.body, { x: this.body.position.x, y });
  }
}
