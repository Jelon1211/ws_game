import { SystemRegister } from "./SystemRegister.js";
import { State } from "../schema/State.js";

export class GameLoop {
  private systemRegistry: SystemRegister;
  constructor(systemRegistry: SystemRegister) {
    this.systemRegistry = systemRegistry;
  }

  public update(state: State, delta: number): void {
    this.systemRegistry.updateAll(state, delta);
  }
}
