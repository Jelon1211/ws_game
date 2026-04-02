import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string")
  nickname!: string;
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") lastProcessedSeq: number = 0;
}
