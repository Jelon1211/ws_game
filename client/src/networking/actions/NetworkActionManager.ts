import type { MsgTypes, TMoveInput } from "../../shared/types/Message";
import type { INetworkAction } from "../../types/Network";

export type ActionMap = {
  [MsgTypes.Move]: INetworkAction<TMoveInput>;
};

export class NetworkActionManager<
  TActions extends Record<string, INetworkAction<any>>,
> {
  private actions: Partial<TActions> = {};

  constructor(private send: (type: any, payload: any) => void) {}

  register<K extends keyof TActions>(key: K, action: TActions[K]) {
    this.actions[key] = action;
  }

  get<K extends keyof TActions>(key: K): TActions[K] {
    const action = this.actions[key];
    if (!action) {
      throw new Error(`Action "${String(key)}" not found`);
    }
    return action;
  }

  update<K extends keyof TActions>(
    key: K,
    input: Parameters<TActions[K]["update"]>[0],
  ) {
    this.actions[key]?.update(input);
  }
}
