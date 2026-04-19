import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";
import { colyseusClient } from "../networking/ColyseusClient";
import { RoomHandler } from "../networking/RoomHandler";
import { MovementSystem } from "../systems/inputs/MovementSystem";
import { MsgTypes } from "../shared/types/Message";
import type {
  ActionMap,
  NetworkActionManager,
} from "../networking/actions/NetworkActionManager";
import { NetworkActionFactory } from "../networking/actions/NetworkActionFactory ";
import { EntityManager } from "../entities/EntityManager";
import { LocalPlayerEntity } from "../entities/LocalPlayerEntity";
import type { MovementAction } from "../networking/actions/MovementAction";
import type { PlayerInitData } from "../types/Player";
import { InputManager } from "../systems/inputs/InputManager";
import { storeDispatcher } from "../store/StoreDispatcher";
import { TickManager } from "../systems/tick/TickManager";
import { GameConfig } from "../shared/configs/GameConfig";

export class GameScene extends Phaser.Scene {
  private roomHandler!: RoomHandler;
  private isSceneReady: boolean = false;

  // Systems managers
  private inputManager!: InputManager;
  private tickManager!: TickManager;

  // Network action managers
  private actions!: NetworkActionManager<ActionMap>;

  // Entities managers
  private entityManager!: EntityManager;

  constructor() {
    super(SceneKeys.Game);
  }

  async create(data: PlayerInitData) {
    this.initalizeSystems();

    const client = colyseusClient.getClient();

    this.entityManager = new EntityManager(data);

    this.roomHandler = new RoomHandler(
      this,
      client,
      this.entityManager,
      storeDispatcher,
      this.tickManager,
    );

    await this.roomHandler.joinOrCreateRoom(data);
    this.actions = NetworkActionFactory.create(
      this.roomHandler,
      this.tickManager,
    );

    // TODO: this is coupling, to refactor
    const sessionId = this.roomHandler.getRoom()!.sessionId;
    const movementAction = this.actions.get(MsgTypes.Move) as MovementAction;

    movementAction.setOnSent((seq, input) => {
      const localPlayer = this.entityManager.getPlayer(sessionId);
      if (localPlayer instanceof LocalPlayerEntity) {
        localPlayer.onInputSent(seq, input);
      }
    });

    this.isSceneReady = true;
  }

  update(_time: number, delta: number): void {
    if (!this.isSceneReady || !this.actions || !this.roomHandler) {
      return;
    }

    this.tickManager.update();
    this.inputManager.dispatch(this.actions);

    const sessionId = this.roomHandler.getRoom()!.sessionId;
    const localPlayer = this.entityManager.getPlayer(sessionId);

    if (localPlayer instanceof LocalPlayerEntity) {
      const movement = this.inputManager.poll(MovementSystem);
      localPlayer.update(delta, movement);
    }

    this.entityManager.update(delta, sessionId);
  }

  private initalizeSystems() {
    this.inputManager = new InputManager(this.input);
    this.tickManager = new TickManager(GameConfig.GAME.TICK_RATE);
  }
}
