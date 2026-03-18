import Phaser from "phaser";
import { RoomHandler } from "../networking/RoomHandler";

type InputState = {
  x: number;
  y: number;
};

type InputConfig = {
  sendRate: number; // ms
};

export class InputSystem {
  private readonly scene: Phaser.Scene;
  private readonly roomHandler: RoomHandler;

  private readonly config: InputConfig = {
    sendRate: 50,
  };

  private lastSentInput: InputState | null = null;
  private lastSendTime = 0;

  private enabled = true;

  constructor(scene: Phaser.Scene, roomHandler: RoomHandler) {
    this.scene = scene;
    this.roomHandler = roomHandler;
  }

  public update(time: number): void {
    if (!this.enabled) {
      return;
    }

    const input = this.getPointerWorld();

    if (!this.shouldSend(input, time)) {
      return;
    }

    this.roomHandler.sendInput(input);

    this.lastSentInput = input;
    this.lastSendTime = time;
  }

  private getPointerWorld(): InputState {
    const pointer = this.scene.input.activePointer;

    return {
      x: pointer.worldX,
      y: pointer.worldY,
    };
  }

  private shouldSend(input: InputState, time: number): boolean {
    if (time - this.lastSendTime < this.config.sendRate) {
      return false;
    }

    if (
      this.lastSentInput &&
      this.lastSentInput.x === input.x &&
      this.lastSentInput.y === input.y
    ) {
      return false;
    }

    return true;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}
