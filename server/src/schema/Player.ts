import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") nickname: string;
  @type("number") x: number = 0;
  @type("number") y: number = 0;

  @type("boolean") left: boolean = false;
  @type("boolean") right: boolean = false;
  @type("boolean") up: boolean = false;
  @type("boolean") down: boolean = false;

  @type("number") lastProcessedSeq: number = 0;

  public inputBuffer: Array<{
    seq: number;
    input: { left: boolean; right: boolean; up: boolean; down: boolean };
  }> = [];
}
