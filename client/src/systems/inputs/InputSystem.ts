export abstract class InputSystem<T> {
  constructor(
    protected readonly keys: Phaser.Types.Input.Keyboard.CursorKeys,
  ) {}
  abstract poll(): T;
}
