import type { ServerHello } from "../../types/server";
import type { NetScene } from "../../scenes/NetScene";
import { MapRenderer } from "../../render/MapRenderer";

export function handleHello(scene: NetScene, data: ServerHello) {
  scene.world = data.world;
  scene.cameras.main.setBounds(0, 0, scene.world.w, scene.world.h);

  scene.mapRenderer = new MapRenderer(scene);
  scene.mapRenderer.render(data.map);
}
