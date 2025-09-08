import Phaser from "phaser";
import type { InputMsg, InputSample } from "../types/input";

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

  init() {
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
  }

  readCurrent() {
    return {
      up: this.cursors.up?.isDown,
      down: this.cursors.down?.isDown,
      left: this.cursors.left?.isDown,
      right: this.cursors.right?.isDown,
    };
  }

  maybeSend(sender: (msg: InputMsg) => void) {
    const now = this.scene.time.now;
    const input = this.readCurrent();
    const changed =
      this.lastInput?.up !== input.up ||
      this.lastInput?.down !== input.down ||
      this.lastInput?.left !== input.left ||
      this.lastInput?.right !== input.right;

    if (changed || now - this.lastSent >= 50) {
      // ~20 Hz
      const msg: InputMsg = { ...input, seq: ++this.seq };
      const dt = (now - this.lastSent) / 1000 || 0.05;
      this.pending.push({ ...msg, dt });
      sender(msg);
      this.lastSent = now;
      this.lastInput = input;
    }
  }

  dropProcessed(seqFromServer: number) {
    this.pending = this.pending.filter((i) => i.seq > seqFromServer);
  }
}
