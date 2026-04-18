export const SceneKeys = {
  Boot: "BootScene",
  Game: "GameScene",
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];
