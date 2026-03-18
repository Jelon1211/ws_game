export const NetworkConstants = {
  // TODO: fron env or sth
  host: "http://localhost:2567",
  mainRoom: "my_room",
} as const;

export type NetworkConstant =
  (typeof NetworkConstants)[keyof typeof NetworkConstants];
