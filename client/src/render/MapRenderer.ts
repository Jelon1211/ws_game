import { Bodies, World, Body } from "matter-js";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import type { IMap } from "../types/map";

export class MapRenderer {
  private physicsEngine: PhysicsEngine = PhysicsEngine.getInstance();
  private mapData: IMap | null = null;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private platformBodies: Body[] = [];
  private platformGraphics: Phaser.GameObjects.Rectangle[] = [];

  constructor(private scene: Phaser.Scene) {}

  public render(mapData: IMap) {
    this.clear();
    this.mapData = mapData;

    this.initMapPhysics();
    this.initMapGraphics();
  }

  private initMapPhysics() {
    if (!this.mapData) return;

    for (const platform of this.mapData.platforms) {
      const platformBody = Bodies.rectangle(
        platform.x,
        platform.y,
        platform.w,
        platform.h,
        { isStatic: true, label: "platform" }
      );
      this.platformBodies.push(platformBody);
      World.add(this.physicsEngine.getWorld(), platformBody);
    }
  }

  private initMapGraphics() {
    if (!this.mapData) return;

    this.platforms = this.scene.physics.add.staticGroup();

    for (const platform of this.mapData.platforms) {
      const rect = this.scene.add.rectangle(
        platform.x,
        platform.y,
        platform.w,
        platform.h,
        0x8868ff
      ) as Phaser.GameObjects.Rectangle;

      this.scene.physics.add.existing(rect, true);
      this.platforms.add(rect);

      this.platformGraphics.push(rect);
    }
  }

  private clear() {
    if (this.platformBodies.length > 0) {
      World.remove(this.physicsEngine.getWorld(), this.platformBodies);
      this.platformBodies = [];
    }

    if (this.platformGraphics.length > 0) {
      this.platformGraphics.forEach((g) => g.destroy());
      this.platformGraphics = [];
    }

    if (this.platforms) {
      this.platforms.clear(true, true);
    }

    this.mapData = null;
  }
}
