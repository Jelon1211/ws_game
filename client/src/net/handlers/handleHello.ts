import type { ServerHello } from "../../types/server";
import type { NetScene } from "../../scenes/NetScene";

export function handleHello(scene: NetScene, data: ServerHello) {
  scene.world = data.world;
  scene.cameras.main.setBounds(0, 0, scene.world.w, scene.world.h);
}
