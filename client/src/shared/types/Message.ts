export enum MsgTypes {
  Move = "move",
  Shoot = "shoot",
}

export type MoveMessage = {
  seq: number;
  clientTime: number;
  input: TMoveInput;
};

export type ShootMessage = {
  shoot: TShootInput;
};

export type RoomMessageMap = {
  [MsgTypes.Move]: MoveMessage;
  [MsgTypes.Shoot]: ShootMessage;
};

// inputs
export type TMoveInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type TShootInput = {
  space: boolean;
};
