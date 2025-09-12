// src/mechanics/PlayerController.ts
import {Body} from "matter-js";
import {Player} from "../models/Player";
import {InputMsg} from "../models/InputMsg";
import {SPEED, JUMP_SPEED, COYOTE_TIME} from "../constants";

export class PlayerController {
  public static handleInput(player: Player, msg: InputMsg) {
    let vx = 0;
    if (msg.left) {
      vx -= SPEED;
    }
    if (msg.right) {
      vx += SPEED;
    }

    // ustaw prędkość poziomą
    Body.setVelocity(player.body, {x: vx, y: player.body.velocity.y});

    // logika skoku z coyote-time
    const now = Date.now();
    const canJump =
      player.onGround || now - player.lastGroundedTime <= COYOTE_TIME;

    if (msg.up && canJump) {
      Body.setVelocity(player.body, {
        x: player.body.velocity.x,
        y: JUMP_SPEED,
      });
      player.onGround = false;
      player.lastGroundedTime = -Infinity;
    }

    player.lastProcessedSeq = msg.seq;
  }
}
