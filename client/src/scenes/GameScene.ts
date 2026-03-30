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

export class GameScene extends Phaser.Scene {
  private roomHandler!: RoomHandler;
  private isSceneReady: boolean = false;

  // Systems
  private inputSytem!: InputSystem;

  // Action managers
  private actions!: NetworkActionManager<ActionMap>;

  constructor() {
    super(SceneKeys.Game);
  }

  async create({ nickname }: { nickname: Player["nickname"] }) {
    this.initalizeSystems();

    const client = colyseusClient.getClient();

    this.roomHandler = new RoomHandler(client, this);

    await this.roomHandler.joinOrCreateRoom(nickname);

    this.actions = NetworkActionFactory.create(this.roomHandler);

    this.isSceneReady = true;
  }

  update(time: number, delta: number): void {
    if (!this.isSceneReady || !this.actions || !this.roomHandler) {
      return;
    }

    const input = this.inputSytem.updateInput();

    this.actions.update(MsgTypes.Move, input);
  }

  private initalizeSystems() {
    this.inputSytem = new InputSystem(this.input);
  }
}
