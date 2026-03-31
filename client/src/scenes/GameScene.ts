import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";
import { colyseusClient } from "../networking/ColyseusClient";
import { Player } from "../networking/schema/Player";
import { RoomHandler } from "../networking/RoomHandler";
import { InputSystem } from "../systems/InputSystem";
import { MsgTypes } from "../shared/types/Message";
import type {
  ActionMap,
  NetworkActionManager,
} from "../networking/actions/NetworkActionManager";
import { NetworkActionFactory } from "../networking/actions/NetworkActionFactory ";
import { EntityManager } from "../entities/EntityManager";
import { LocalPlayerEntity } from "../entities/LocalPlayerEntity";

export class GameScene extends Phaser.Scene {
  private roomHandler!: RoomHandler;
  private isSceneReady: boolean = false;

  // Systems
  private inputSytem!: InputSystem;

  // Action managers
  private actions!: NetworkActionManager<ActionMap>;

  // Entities
  private entityManager!: EntityManager;

  constructor() {
    super(SceneKeys.Game);
  }

  async create({ nickname }: { nickname: Player["nickname"] }) {
    this.initalizeSystems();

    const client = colyseusClient.getClient();

    this.entityManager = new EntityManager();

    this.roomHandler = new RoomHandler(this, client, this.entityManager);

    await this.roomHandler.joinOrCreateRoom(nickname);

    this.actions = NetworkActionFactory.create(this.roomHandler);

    this.isSceneReady = true;
  }

  update(time: number, delta: number): void {
    if (!this.isSceneReady || !this.actions || !this.roomHandler) {
      return;
    }
    const sessionId = this.roomHandler.getRoom()!.sessionId;

    const input = this.inputSytem.updateInput();

    const localPlayer = this.entityManager.getPlayer(sessionId);

    if (localPlayer instanceof LocalPlayerEntity) {
      localPlayer.update(delta, input);
    }

    this.actions.update(MsgTypes.Move, input);

    this.entityManager.update(delta, sessionId);
  }

  private initalizeSystems() {
    this.inputSytem = new InputSystem(this.input);
  }
}
