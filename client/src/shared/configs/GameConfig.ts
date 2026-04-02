export const GameConfig = {
  WORLD: {
    WIDTH: 800,
    HEIGHT: 600,
  },

  PLAYER: {
    BASE_SPEED: 200,
  },

  GAME: {
    FPS: 60,
    get TICK_RATE() {
      return 1000 / this.FPS;
    },
  },
} as const;
