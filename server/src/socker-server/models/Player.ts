import {Body} from "matter-js";

export class Player {
  public id: string;
  public body: Body;
  public lastProcessedSeq = 0;
  public onGround = false;
  public lastGroundedTime = -Infinity;

  constructor(id: string, body: Body) {
    this.id = id;
    this.body = body;
  }
}
