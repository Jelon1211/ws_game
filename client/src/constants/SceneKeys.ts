export const SceneKeys = {
  Boot: "BootScene",
  Game: "GameScene",
  UI: "UIScene",
  Menu: "MenuScene",
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];
