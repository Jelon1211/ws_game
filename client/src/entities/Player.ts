import Phaser from "phaser";
import { BaseEntity } from "./BaseEntity";
import { massToRadius } from "../utils/math";
import type { PlayerState } from "../types";

export class Player extends BaseEntity<PlayerState> {
  private readonly bodyCircle: Phaser.GameObjects.Arc;

  private _mass: number = 10;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y, id);

    this.bodyCircle = scene.add.circle(
      0,
      0,
      massToRadius(this._mass),
      0x00ff00,
    );
    this.add(this.bodyCircle);
  }

  get mass(): number {
    return this._mass;
  }

  private setMass(value: number): void {
    if (value === this._mass) return;

    this._mass = value;

    const radius = massToRadius(this._mass);
    this.bodyCircle.setRadius(radius);
  }

  updateFromServer(data: PlayerState): void {
    this.setTargetPosition(data.x, data.y);
    this.setMass(data.mass);
  }
}
