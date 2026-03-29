export class InputSystem {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(phaserInput: Phaser.Input.InputPlugin) {
    if (!phaserInput.keyboard) {
      console.warn("phaserInput not loaded");
    }

    this.cursorKeys = phaserInput.keyboard!.createCursorKeys();
  }

  public updateInput(): {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
  } {
    return {
      left: this.cursorKeys.left.isDown,
      right: this.cursorKeys.right.isDown,
      up: this.cursorKeys.up.isDown,
      down: this.cursorKeys.down.isDown,
    };
  }
}
