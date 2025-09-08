import type { ServerHello, ServerState } from "../types/server";
import type { InputMsg } from "../types/input";
import io, { Socket } from "socket.io-client";

export class NetworkClient {
  private socket!: Socket;
  myId: string | null = null;

  connect(
    url: string,
    onHello: (hello: ServerHello) => void,
    onState: (state: ServerState) => void
  ) {
    this.socket = io(url);
    this.socket.on("hello", (data: ServerHello) => {
      this.myId = data.id;
      onHello(data);
    });
    this.socket.on("state", (state: ServerState) => onState(state));
  }

  sendInput(msg: InputMsg) {
    this.socket.emit("input", msg);
  }

  destroy() {
    this.socket?.disconnect();
  }
}
