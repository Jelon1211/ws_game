import { Player } from "../schema/Player.js";

export class PlayerEntity {
  static setTarget(player: Player, x: number, y: number): void {
    player.targetX = x;
    player.targetY = y;
  }

  static move(player: Player, dx: number, dy: number): void {
    player.x += dx;
    player.y += dy;
  }

  static addMass(player: Player, amount: number): void {
    player.mass += amount;
  }

  static getSpeed(player: Player): number {
    return 200 / Math.sqrt(player.mass);
  }

  static getRadius(player: Player): number {
    return Math.sqrt(player.mass) * 4;
  }

  static distanceTo(player: Player, x: number, y: number): number {
    const dx = x - player.x;
    const dy = y - player.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
