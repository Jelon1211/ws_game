import Phaser from "phaser";
import type { TInput } from "../shared/types/Message";
import type { PlayerInitData } from "src/types/Player";

export class PlayerEntity {
  public sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  protected targetX: number;
  protected targetY: number;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    options: PlayerInitData,
  ) {
    this.sprite = scene.physics.add.image(x, y, "player_ship");

    this.targetX = x;
    this.targetY = y;
  }

  public setServerState(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  public update(delta: number, input: TInput | null = null) {
    // always override
  }

  public destroy() {
    this.sprite.destroy();
  }
}
