import Phaser from "phaser";
import { Player } from "../entities/Player";

type CameraConfig = {
  followLerp: number;
  minZoom: number;
  maxZoom: number;
  zoomSmoothing: number;
  zoomFactor: number;
  zoomOffset: number;
};

export class CameraSystem {
  private readonly camera: Phaser.Cameras.Scene2D.Camera;

  private target?: Player | undefined;
  private currentZoom: number = 1;

  private readonly config: CameraConfig = {
    followLerp: 0.1,
    minZoom: 0.2,
    maxZoom: 1,
    zoomSmoothing: 0.1,
    zoomFactor: 100,
    zoomOffset: 50,
  };

  constructor(scene: Phaser.Scene) {
    this.camera = scene.cameras.main;
  }

  public follow(player: Player): void {
    this.target = player;

    this.camera.startFollow(
      player,
      true,
      this.config.followLerp,
      this.config.followLerp,
    );
  }

  public clearFollow(): void {
    this.target = undefined;
    this.camera.stopFollow();
  }

  public update(): void {
    if (!this.target) {
      return;
    }

    this.updateZoom();
  }

  private updateZoom(): void {
    if (!this.target) {
      console.log("CameraSystem: No target to follow for zooming.");
      return;
    }
    const mass = this.target.mass;

    const desiredZoom = Phaser.Math.Clamp(
      this.config.zoomFactor / (mass + this.config.zoomOffset),
      this.config.minZoom,
      this.config.maxZoom,
    );

    this.currentZoom = Phaser.Math.Linear(
      this.currentZoom,
      desiredZoom,
      this.config.zoomSmoothing,
    );

    this.camera.setZoom(this.currentZoom);
  }
}
