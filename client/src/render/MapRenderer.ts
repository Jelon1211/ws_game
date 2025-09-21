import { Bodies, World, Body } from "matter-js";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import type { IMap } from "../types/map";
import { DEBUG_MODE } from "../config";

export class MapRenderer {
  private physicsEngine: PhysicsEngine = PhysicsEngine.getInstance();
  private mapData: any | null = null; // TODO: add proper type

  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private platformBodies: Body[] = [];
  private platformGraphics: Phaser.GameObjects.Rectangle[] = [];

  private phaserMap?: Phaser.Tilemaps.Tilemap;
  private phaserLayer?: Phaser.Tilemaps.TilemapLayer;

  constructor(private scene: Phaser.Scene) {}

  public render(mapData: any) {
    this.clear();
    this.mapData = mapData;

    this.initTileLayer();
    this.initMapPhysics();
    if (Boolean(DEBUG_MODE)) {
      this.initMapGraphics();
    }
  }

  private initTileLayer() {
    if (!this.mapData) return;

    const tileLayerData = this.mapData.layers.find(
      (l: any) => l.type === "tilelayer"
    );
    if (!tileLayerData) {
      console.warn("❌ Brak tilelayer w mapie!");
      return;
    }

    const tilesetDef = this.mapData.tilesets[0];
    if (!tilesetDef) {
      console.error("❌ Brak tilesetDef w mapie!");
      return;
    }

    const firstgid = tilesetDef.firstgid;

    // 🔧 Budujemy tablicę 2D z indeksami 0-based
    const rows2D: number[][] = [];
    for (let y = 0; y < tileLayerData.height; y++) {
      const row: number[] = [];
      for (let x = 0; x < tileLayerData.width; x++) {
        const idx = y * tileLayerData.width + x;
        let gid = tileLayerData.data[idx];

        if (gid >= firstgid) {
          gid = gid - firstgid; // zamieniamy na indeks w tilesecie
        } else {
          gid = -1; // brak kafelka
        }

        row.push(gid);
      }
      rows2D.push(row);
    }

    const map = this.scene.make.tilemap({
      data: rows2D,
      tileWidth: this.mapData.tilewidth,
      tileHeight: this.mapData.tileheight,
    });

    const tileset = map.addTilesetImage(
      tilesetDef.name,
      tilesetDef.name,
      this.mapData.tilewidth,
      this.mapData.tileheight,
      0,
      0
    );
    if (!tileset) {
      console.error("❌ Tileset nie został znaleziony!", tilesetDef);
      return;
    }

    this.phaserMap = map;

    const layer = map.createLayer(0, tileset, 0, -20);
    if (!layer) {
      console.error("❌ Nie udało się stworzyć warstwy!");
      return;
    }

    this.phaserLayer = layer;
  }

  private initMapPhysics() {
    if (!this.mapData) return;

    const platformsLayer = this.mapData.layers.find(
      (l: any) => l.type === "objectgroup" && l.name === "Platforms"
    );

    if (!platformsLayer) {
      return;
    }

    for (const obj of platformsLayer.objects) {
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

    const platformsLayer = this.mapData.layers.find(
      (l: any) => l.type === "objectgroup" && l.name === "Platforms"
    );
    if (!platformsLayer) {
      console.warn("Brak warstwy Platforms w mapie!");
      return;
    }

    for (const obj of platformsLayer.objects) {
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;

      const rect = this.scene.add.rectangle(
        x,
        y,
        obj.width,
        obj.height,
        0x8868ff,
        0.4
      );

      this.scene.physics.add.existing(rect, true);
      this.platforms.add(rect);

      this.platformGraphics.push(rect);
    }
  }

  private clear() {
    if (this.phaserLayer) {
      this.phaserLayer.destroy();
      this.phaserLayer = undefined;
    }
    if (this.phaserMap) {
      this.phaserMap.destroy();
      this.phaserMap = undefined;
    }

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
