import { State } from "../schema/State.js";

interface ISystem {
  update(state: State, delta: number): void;
}

export class SystemRegister {
  private systems: ISystem[] = [];

  public register(system: ISystem) {
    this.systems.push(system);
    return this;
  }

  public updateAll(state: State, delta: number) {
    for (const system of this.systems) {
      system.update(state, delta);
    }
  }
}
