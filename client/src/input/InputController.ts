import Phaser from "phaser";
import type { InputMsg, InputSample } from "../types/input";
import { LAST_MSG_SENT } from "../config";

export class InputController {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private lastSent = 0;
  private lastInput: Partial<
    Record<"up" | "down" | "left" | "right", boolean>
  > | null = null;
  seq = 0;
  pending: InputSample[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init() {
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
  }

  public readCurrent() {
    return {
      up: this.cursors.up?.isDown,
      down: this.cursors.down?.isDown,
      left: this.cursors.left?.isDown,
      right: this.cursors.right?.isDown,
    };
  }

  public maybeSend(sender: (msg: InputMsg) => void) {
    const now = this.scene.time.now;
    const input = this.readCurrent();
    const changed =
      this.lastInput?.up !== input.up ||
      this.lastInput?.down !== input.down ||
      this.lastInput?.left !== input.left ||
      this.lastInput?.right !== input.right;

    if (changed || now - this.lastSent >= LAST_MSG_SENT) {
      // ~20 Hz
      const msg: InputMsg = { ...input, seq: ++this.seq };
      const dt = (now - this.lastSent) / 1000 || 0.05;
      this.pending.push({ ...msg, dt });
      sender(msg);
      this.lastSent = now;
      this.lastInput = input;
    }
  }

  public dropProcessed(seqFromServer: number) {
    this.pending = this.pending.filter((i) => i.seq > seqFromServer);
  }
}
