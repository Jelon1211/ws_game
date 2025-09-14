import {Bodies, Engine, World} from "matter-js";
import {WORLD} from "../constants";
import * as fs from "fs";
import * as path from "path";

// TODO: move to types
type MapJson = {
  platforms: {x: number; y: number; w: number; h: number}[];
};

export class WorldBuilder {
  public static worldMap: MapJson;

  constructor(private engine: Engine) {
    this.init();
  }

  public init() {
    const mapPath = path.resolve(__dirname, "../../data-sources/maps/01.json");
    const mapJson = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
    WorldBuilder.worldMap = mapJson;
    this.loadFromJson(mapJson);
  }

  private loadFromJson(map: MapJson) {
    const bodies = [];

    bodies.push(...this.createWalls());

    for (const p of map.platforms) {
      bodies.push(
        Bodies.rectangle(p.x, p.y, p.w, p.h, {
          isStatic: true,
          label: "platform",
        })
      );
    }

    World.add(this.engine.world, bodies);
  }

  private createWalls() {
    const t = 30; // TODO: move to const
    const w = WORLD.w;
    const h = WORLD.h;
    return [
      Bodies.rectangle(w / 2, h + t / 2, w, t, {
        isStatic: true,
        label: "ground",
      }),
      Bodies.rectangle(w / 2, -t / 2, w, t, {
        isStatic: true,
        label: "ceiling",
      }),
      Bodies.rectangle(-t / 2, h / 2, t, h, {
        isStatic: true,
        label: "leftWall",
      }),
      Bodies.rectangle(w + t / 2, h / 2, t, h, {
        isStatic: true,
        label: "rightWall",
      }),
    ];
  }
}
