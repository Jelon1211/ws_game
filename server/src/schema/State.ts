import { Schema, type, MapSchema } from "@colyseus/schema";

import { Player } from "./Player.js";

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}
