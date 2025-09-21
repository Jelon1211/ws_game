import Phaser from "phaser";

export class AvatarAnimations {
  // TODO: mange these animations somehow better
  public static register(scene: Phaser.Scene) {
    scene.anims.create({
      key: "walk_local",
      frames: scene.anims.generateFrameNumbers("chicken", { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: "up_local",
      frames: scene.anims.generateFrameNumbers("chicken", {
        start: 10,
        end: 12,
      }),
      frameRate: 8,
      repeat: 0,
    });

    scene.anims.create({
      key: "walk_remote",
      frames: scene.anims.generateFrameNumbers("chickenRemote", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: "up_remote",
      frames: scene.anims.generateFrameNumbers("chickenRemote", {
        start: 10,
        end: 12,
      }),
      frameRate: 8,
      repeat: 0,
    });
  }
}
