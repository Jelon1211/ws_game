import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") nickname: string;
  @type("number") x: number = 0;
  @type("number") y: number = 0;

  @type("boolean") left = false;
  @type("boolean") right = false;
  @type("boolean") up = false;
  @type("boolean") down = false;
}
