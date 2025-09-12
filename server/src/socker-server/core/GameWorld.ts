import {Engine, World, Composite} from "matter-js";
import {Player} from "../models/Player";
import {GRAVITY, TICK_RATE} from "../constants";
import {CollisionManager} from "../physics/CollisionManager";
import {WorldBuilder} from "./WorldBuilder";

export class GameWorld {
  public engine: Engine;
  private players: Map<string, Player> = new Map();
  private collisionManager: CollisionManager;
  private worldBuilder: WorldBuilder;

  constructor() {
    this.engine = Engine.create({
      gravity: {
        x: 0,
        y: GRAVITY / 1000,
      },
    });

    this.worldBuilder = new WorldBuilder(this.engine);
    this.collisionManager = new CollisionManager(this.engine, () =>
      this.players.values()
    );
  }

  public addPlayer(player: Player) {
    World.add(this.engine.world, player.body);
    this.players.set(player.id, player);
  }

  public removePlayer(id: string) {
    const player = this.players.get(id);
    if (!player) return;
    Composite.remove(this.engine.world, player.body);
    this.players.delete(id);
  }

  public update() {
    Engine.update(this.engine, 1000 / TICK_RATE);
  }

  public getPlayers() {
    return this.players;
  }
}
