import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";
import { colyseusClient } from "../networking/ColyseusClient";
import { Player } from "../networking/schema/Player";
import { RoomHandler } from "../networking/RoomHandler";
import { InputSystem } from "../systems/InputSystem";
import { MsgTypes } from "../shared/types/Message";

export class GameScene extends Phaser.Scene {
  private roomHandler!: RoomHandler;

  // Systems
  private inputSytem!: InputSystem;

  constructor() {
    super(SceneKeys.Game);
  }

  async create({ nickname }: { nickname: Player["nickname"] }) {
    this.initalizeSystems();

    const client = colyseusClient.getClient();

    this.roomHandler = new RoomHandler(client, this);

    await this.roomHandler.joinOrCreateRoom(nickname);
  }

  update(time: number, delta: number): void {
    if (!this.roomHandler) {
      console.warn("No room handler!");
      return;
    }

    const input = this.inputSytem.updateInput();

    this.roomHandler.roomSend(MsgTypes.Move, input);
  }

  private initalizeSystems() {
    this.inputSytem = new InputSystem(this.input);
  }
}
