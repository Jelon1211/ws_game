export type InputMsg = {
  seq: number;
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
};
export type InputSample = InputMsg & { dt: number };
