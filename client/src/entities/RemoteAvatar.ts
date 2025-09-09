import { Avatar } from "./Avatar";

export class RemoteAvatar extends Avatar {
  private activeTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number) {
    super(scene, id, x, y, 0x999999, 10);
  }

  public lerpTo(
    x: number,
    y: number,
    durationMs = import.meta.env.VITE_LERP_DURATION
  ) {
    this.activeTween?.remove();
    this.activeTween = this.scene.tweens.add({
      targets: this as any, // x/y getter/setter
      x,
      y,
      duration: durationMs,
      ease: "Linear",
    });
  }
}
