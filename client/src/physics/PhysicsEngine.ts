import { Engine } from "matter-js";

export class PhysicsEngine {
  private static instance: PhysicsEngine | null = null;
  private engine: Engine;

  private constructor() {
    this.engine = Engine.create({
      gravity: {
        x: 0,
        // y: GRAVITY / 1000 - DISABLED CLIENT GRAVITY
        y: 0,
      },
    });
  }

  public static getInstance(): PhysicsEngine {
    if (!PhysicsEngine.instance) {
      PhysicsEngine.instance = new PhysicsEngine();
    }
    return PhysicsEngine.instance;
  }

  public getEngine() {
    return this.engine;
  }

  public getWorld() {
    return this.engine.world;
  }
}
