export const GameConfig = {
  WORLD: {
    WIDTH: 1280,
    HEIGHT: 720,
  },

  PLAYER: {
    BASE_SPEED: 500,
    MASS_RADIUS_FACTOR: 4,
    START_MASS: 10,
  },

  FOOD: {
    MAX_COUNT: 200,
    RADIUS: 5,
    MASS_GAIN: 1,
  },

  GAME: {
    TICK_RATE: 1000 / 60,
  },
} as const;
