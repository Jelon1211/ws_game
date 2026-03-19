import { State } from "../schema/State.js";
import { Player } from "../schema/Player.js";
import { Food } from "../schema/Food.js";

export class CollisionSystem {
  static update(state: State): void {
    state.players.forEach((player, playerId) => {
      this.checkFoodCollision(state, player, playerId);
    });
  }

  private static checkFoodCollision(
    state: State,
    player: Player,
    playerId: string,
  ): void {
    state.foods.forEach((food, foodId) => {
      const dx = food.x - player.x;
      const dy = food.y - player.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const radius = this.getRadius(player.mass);

      if (distance < radius) {
        player.mass += 1;

        state.foods.delete(foodId);
      }
    });
  }

  private static getRadius(mass: number): number {
    return Math.sqrt(mass) * 4;
  }

  private static checkPlayerCollision(state: State): void {
    const players = Array.from(state.players.entries());

    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const [idA, a] = players[i];
        const [idB, b] = players[j];

        this.handlePlayerVsPlayer(state, idA, a, idB, b);
      }
    }
  }

  private static handlePlayerVsPlayer(
    state: State,
    idA: string,
    a: Player,
    idB: string,
    b: Player,
  ): void {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const radiusA = Math.sqrt(a.mass) * 4;
    const radiusB = Math.sqrt(b.mass) * 4;

    if (radiusA > radiusB * 1.1 && distance < radiusA) {
      a.mass += b.mass;
      state.players.delete(idB);
    } else if (radiusB > radiusA * 1.1 && distance < radiusB) {
      b.mass += a.mass;
      state.players.delete(idA);
    }
  }
}
