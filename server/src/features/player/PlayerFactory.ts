import { Player } from "../../schema/Player.js";
import { GameConfig } from "../../shared/configs/GameConfig.js";

export class PlayerFactory {
  static create(nickname: string): Player {
    const player = new Player();
    player.nickname = nickname;
    player.x = Math.random() * GameConfig.WORLD.WIDTH;
    player.y = Math.random() * GameConfig.WORLD.HEIGHT;
    return player;
  }
}
