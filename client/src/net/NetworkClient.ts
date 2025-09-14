import type { ServerHello, ServerState } from "../types/server";
import type { InputMsg } from "../types/input";
import io, { Socket } from "socket.io-client";
import { FromServerEventsEnum } from "../enums/events";

export class NetworkClient extends Phaser.Events.EventEmitter {
  private static instance: NetworkClient;
  private socket!: Socket;
  public myId: string | null = null;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!NetworkClient.instance) {
      NetworkClient.instance = new NetworkClient();
    }
    return NetworkClient.instance;
  }

  public init() {
    this.connect();
    this.onHelloEvent();
    this.onStateEvent();
  }

  private connect() {
    // TODO: add reconnect
    if (this.socket?.connected) {
      return;
    }
    this.socket = io(import.meta.env.VITE_SERVER_URL);
  }

  private onHelloEvent() {
    this.socket.on(FromServerEventsEnum.HELLO, (data: ServerHello) => {
      this.myId = data.id;
      this.emit(FromServerEventsEnum.HELLO, data);
    });
  }

  private onStateEvent() {
    this.socket.on(FromServerEventsEnum.STATE, (state: ServerState) => {
      this.emit(FromServerEventsEnum.STATE, state);
    });
  }

  public isConnected(): boolean {
    return !!(this.socket && this.socket.connected);
  }

  public sendInput(msg: InputMsg) {
    this.socket.emit("input", msg);
  }

  public destroy() {
    this.socket?.disconnect();
    this.removeAllListeners();
    this.socket = undefined as any;
  }
}

export const networkClient = NetworkClient.getInstance();
