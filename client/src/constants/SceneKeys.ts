export const SceneKeys = {
  Boot: "BootScene",
  Game: "GameScene",
  UI: "UIScene",
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];
