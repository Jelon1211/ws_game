export enum MsgTypes {
  Move = "move",
}

export type TInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type MoveMessage = {
  seq: number;
  clientTime: number;
  input: TInput;
};

export type RoomMessageMap = {
  [MsgTypes.Move]: MoveMessage;
};
