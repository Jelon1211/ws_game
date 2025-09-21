import { Bodies, World, Body } from "matter-js";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import type { IMap } from "../types/map";

export class MapRenderer {
  private physicsEngine: PhysicsEngine = PhysicsEngine.getInstance();
  private mapData: any | null = null; //TODO: add proper type
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

    const platformsLayer = this.mapData.layers.find(
      (l: any) => l.type === "objectgroup" && l.name === "Platforms"
    );
    if (!platformsLayer) {
      console.warn("Brak warstwy Platforms w mapie!");
      return;
    }

    for (const obj of platformsLayer.objects) {
      // Tiled: x,y = lewy górny róg; Matter.js: x,y = środek
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;

      const platformBody = Bodies.rectangle(x, y, obj.width, obj.height, {
        isStatic: true,
        label: "platform",
      });

      this.platformBodies.push(platformBody);
      World.add(this.physicsEngine.getWorld(), platformBody);
    }
  }

  private initMapGraphics() {
    if (!this.mapData) return;

    this.platforms = this.scene.physics.add.staticGroup();

    // znajdź warstwę "Platforms" w JSON-ie Tiled
    const platformsLayer = this.mapData.layers.find(
      (l: any) => l.type === "objectgroup" && l.name === "Platforms"
    );
    if (!platformsLayer) {
      console.warn("Brak warstwy Platforms w mapie!");
      return;
    }

    for (const obj of platformsLayer.objects) {
      // Uwaga: Tiled podaje x,y = lewy górny róg, a Phaser (tak jak Matter) liczy od środka
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;

      const rect = this.scene.add.rectangle(
        x,
        y,
        obj.width,
        obj.height,
        0x8868ff
      );

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
