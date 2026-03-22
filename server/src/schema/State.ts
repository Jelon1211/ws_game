import { Schema, type, MapSchema } from "@colyseus/schema";

import { Player } from "./Player";
import { Food } from "./Food";

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ map: Food })
  foods = new MapSchema<Food>();
}
