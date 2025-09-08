export type ServerHello = { id: string; world: { w: number; h: number } };
export type ServerPlayer = {
  id: string;
  x: number;
  y: number;
  lastProcessedSeq: number;
};
export type ServerState = { t: number; players: ServerPlayer[] };
