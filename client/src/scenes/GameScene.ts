import Phaser from "phaser";

import { SceneKeys } from "../constants/SceneKeys";
import { RoomHandler } from "../networking/RoomHandler";

import { Player } from "../entities/Player";
import { Food } from "../entities/Food";

import { InputSystem } from "../systems/InputSystem";
import { InterpolationSystem } from "../systems/InterpolationSystem";
import { CameraSystem } from "../systems/CameraSystem";

export class GameScene extends Phaser.Scene {
  private readonly roomHandler = new RoomHandler();

  private inputSystem?: InputSystem;
  private interpolationSystem?: InterpolationSystem;
  private cameraSystem?: CameraSystem;

  private playerEntities: Record<string, Player> = {};
  private foodEntities: Record<string, Food> = {};

  private myPlayerId?: string;

  private isSceneReady = false;

  constructor() {
    super(SceneKeys.Game);
  }

  async create(data: { nickname: string }): Promise<void> {
    console.log("data w gamescene: ", data);
    await this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.initializeNetwork();

    this.initializeSystems();
    this.registerListeners();

    this.isSceneReady = true;
  }

  update(time: number, delta: number): void {
    if (!this.isSceneReady) {
      return;
    }
    this.inputSystem!.update(time);

    this.updateInterpolation(delta);

    this.cameraSystem!.update();
  }

  private async initializeNetwork(): Promise<void> {
    await this.roomHandler.join();
    this.myPlayerId = this.roomHandler.sessionId;
  }

  private registerListeners(): void {
    this.roomHandler.listenPlayers({
      onAdd: (player, sessionId) => {
        const entity = new Player(this, player.x, player.y, sessionId);
        this.playerEntities[sessionId] = entity;

        if (sessionId === this.myPlayerId) {
          this.cameraSystem!.follow(entity);
        }
      },

      onChange: (player, sessionId) => {
        this.playerEntities[sessionId]?.updateFromServer(player);
      },

      onRemove: (sessionId) => {
        this.playerEntities[sessionId]?.destroyEntity();
        delete this.playerEntities[sessionId];
      },
    });

    this.roomHandler.listenFood({
      onAdd: (food, id) => {
        const entity = new Food(this, food.x, food.y, id);
        this.foodEntities[id] = entity;
      },

      onChange: (food, id) => {
        this.foodEntities[id]?.updateFromServer(food);
      },

      onRemove: (id) => {
        this.foodEntities[id]?.destroyEntity();
        delete this.foodEntities[id];
      },
    });
  }

  private initializeSystems(): void {
    this.inputSystem = new InputSystem(this, this.roomHandler);
    this.interpolationSystem = new InterpolationSystem();
    this.cameraSystem = new CameraSystem(this);
  }

  private updateInterpolation(delta: number): void {
    Object.values(this.playerEntities).forEach((entity) => {
      const { x, y } = entity.getTargetPosition();

      this.interpolationSystem!.interpolatePosition(entity, x, y, delta);
    });

    Object.values(this.foodEntities).forEach((entity) => {
      const { x, y } = entity.getTargetPosition();

      this.interpolationSystem!.interpolatePosition(entity, x, y, delta);
    });
  }
}
