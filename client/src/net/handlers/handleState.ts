import type { ServerState } from "../../types/server";
import type { NetScene } from "../../scenes/NetScene";
import { RemoteAvatar } from "../../entities/RemoteAvatar";

export function handleState(scene: NetScene, state: ServerState) {
  const myId = scene.net.myId!;

  for (const state_player of state.players) {
    if (state_player.id === myId) {
      scene.inputs.pending = scene.sync.applySelfSnapshot(
        state_player,
        scene.inputs.pending
      );
    } else {
      if (!scene.others.has(state_player.id)) {
        scene.others.set(
          state_player.id,
          new RemoteAvatar(
            scene,
            state_player.id,
            state_player.x,
            state_player.y
          )
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
