import type { Player } from "../networking/schema/Player";

export interface PlayerInitData {
  nickname: Player["nickname"];
  color: string;
}
