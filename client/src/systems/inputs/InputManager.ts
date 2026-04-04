import { MsgTypes } from "../../shared/types/Message";
import type { InputSystem } from "./InputSystem";
import { MovementSystem } from "./MovementSystem";
import { ShootSystem } from "./ShootSystem";

interface InputBinding<T> {
  system: InputSystem<T>;
  msgType: MsgTypes;
}

interface IActions {
  update(msgType: MsgTypes, payload: unknown): void;
}

export class InputManager {
  private readonly bindings: InputBinding<unknown>[] = [];
  private readonly keys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(phaserInput: Phaser.Input.InputPlugin) {
    if (!phaserInput.keyboard) {
      throw new Error("Keyboard plugin unavailable");
    }
    this.keys = phaserInput.keyboard.createCursorKeys();
    this.register();
  }

  private register(): void {
    this.add(new MovementSystem(this.keys), MsgTypes.Move);
    this.add(new ShootSystem(this.keys), MsgTypes.Shoot);
  }

  private add<T>(system: InputSystem<T>, msgType: MsgTypes): void {
    this.bindings.push({ system, msgType });
  }

  dispatch(actions: IActions): void {
    for (const { system, msgType } of this.bindings) {
      actions.update(msgType, system.poll());
    }
  }

  poll<T>(
    SystemClass: new (
      keys: Phaser.Types.Input.Keyboard.CursorKeys,
    ) => InputSystem<T>,
  ): T {
    const binding = this.bindings.find((b) => b.system instanceof SystemClass);
    if (!binding) {
      throw new Error(`System ${SystemClass.name} not registered`);
    }
    return (binding.system as InputSystem<T>).poll();
  }
}
