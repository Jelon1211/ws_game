export interface INetworkAction<T> {
  update(data: T): void;
}

export enum MessageMode {
  UPDATE = "update",
  EVNET = "event",
}
