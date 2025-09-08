import type { ServerHello, ServerState } from "../types/server";
import type { InputMsg } from "../types/input";
import io, { Socket } from "socket.io-client";

export class NetworkClient {
  private socket!: Socket;
  public myId: string | null = null;

  public connect(
    url: string,
    onHello: (hello: ServerHello) => void,
    onState: (state: ServerState) => void
  ) {
    this.socket = io(url);
    this.socket.on("hello", (data: ServerHello) => {
      console.log(data);
      this.myId = data.id;
      onHello(data);
    });
    this.socket.on("state", (state: ServerState) => {
      onState(state);
    });
  }

  public sendInput(msg: InputMsg) {
    this.socket.emit("input", msg);
  }

  public destroy() {
    this.socket?.disconnect();
  }
}
