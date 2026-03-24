import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";

export class MenuScene extends Phaser.Scene {
  private nicknameInput: HTMLInputElement | null = null;

  constructor() {
    super(SceneKeys.Menu);
  }

  create(): void {
    this.createHTMLInput();
    this.createJoinButton();
  }

  private createHTMLInput(): void {
    this.nicknameInput = document.createElement("input");
    this.nicknameInput.placeholder = "Enter nickname";
    this.nicknameInput.style.position = "absolute";
    this.nicknameInput.style.top = "50%";
    this.nicknameInput.style.left = "50%";
    this.nicknameInput.style.transform = "translate(-50%, -50%)";

    document.body.appendChild(this.nicknameInput);
  }

  private createJoinButton(): void {
    const button = this.add
      .text(640, 420, "JOIN GAME", {
        fontSize: "32px",
        color: "#000",
        backgroundColor: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    button.on("pointerdown", () => {
      if (!this.nicknameInput?.value) {
        return console.warn("You need a nickname!");
      }
      const nickname = this.nicknameInput.value;

      this.nicknameInput.remove();

      this.scene.start(SceneKeys.Game, { nickname });
      this.scene.launch(SceneKeys.UI);
    });
  }
}
