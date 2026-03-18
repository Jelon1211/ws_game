import { Client } from "@colyseus/sdk";
import { NetworkConstants } from "../constants/Network";

class ColyseusClient {
  private readonly client: Client;

  constructor() {
    this.client = new Client(NetworkConstants.host);
  }

  public getClient(): Client {
    return this.client;
  }
}

export const colyseusClient = new ColyseusClient();
