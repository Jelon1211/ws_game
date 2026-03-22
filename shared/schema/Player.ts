import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;

  @type("number") targetX: number = 0;
  @type("number") targetY: number = 0;

  @type("number") mass: number = 10;
}
