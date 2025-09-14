import { Avatar } from "./Avatar";
import { LocalPhysics } from "../physics/LocalPhysics";

export class LocalAvatar extends Avatar {
  private physics: LocalPhysics;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, 0x3366ff, 15);
    this.physics = new LocalPhysics(scene, x, y);
  }

  public predictMove(input: { up?: boolean; left?: boolean; right?: boolean }) {
    this.physics.step(input);
    const pos = this.physics.position;
    this.x = pos.x;
    this.y = pos.y;
  }

  public setFromAuthoritative(x: number, y: number) {
    this.physics.setFromAuthoritative(x, y);
    this.x = x;
    this.y = y;
  }
}
