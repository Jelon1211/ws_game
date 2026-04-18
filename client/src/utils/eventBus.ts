import mitt from "mitt";

export type GameEvents = {
  "game:player-died": { killer: string };
};

export const bus = mitt<GameEvents>();
