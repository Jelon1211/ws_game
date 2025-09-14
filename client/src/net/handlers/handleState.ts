import type { ServerState } from "../../types/server";
import type { NetScene } from "../../scenes/NetScene";

export function handleState(scene: NetScene, state: ServerState) {
  const myId = scene.net.myId!;

  for (const sp of state.players) {
    if (sp.id === myId) {
      scene.inputs.pending = scene.sync.applySelfSnapshot(
        sp,
        scene.inputs.pending
      );
    } else {
      if (!scene.others.has(sp.id)) {
        scene.others.set(
          sp.id,
          new scene.constructor.prototype.RemoteAvatar(scene, sp.id, sp.x, sp.y)
        );
      }
    }
  }

  // Delete ghosts
  const liveIds = new Set(state.players.map((p) => p.id));
  for (const id of Array.from(scene.others.keys())) {
    if (!liveIds.has(id)) {
      scene.others.get(id)?.destroy();
      scene.others.delete(id);
    }
  }

  const remotes = state.players.filter((p) => p.id !== myId);
  scene.sync.applyRemoteSnapshot(remotes);
}
