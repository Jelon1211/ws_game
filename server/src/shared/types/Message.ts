export enum MsgTypes {
  Move = "move",
}

export type RoomMessageMap = {
  [MsgTypes.Move]: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
  };
};
