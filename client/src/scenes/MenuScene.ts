import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";

export class MenuScene extends Phaser.Scene {
  private nicknameInput: HTMLInputElement | null = null;
  private colorInput: HTMLInputElement | null = null;

  constructor() {
    super(SceneKeys.Menu);
  }

  create(): void {
    this.createHTMLInput();
    this.createJoinButton();
    this.createColorPicker();
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

  private createColorPicker(): void {
    this.colorInput = document.createElement("input");
    this.colorInput.type = "color";
    this.colorInput.value = "#00ff00";

    this.colorInput.style.position = "absolute";
    this.colorInput.style.top = "60%";
    this.colorInput.style.left = "50%";
    this.colorInput.style.transform = "translate(-50%, -50%)";

    document.body.appendChild(this.colorInput);
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
      const color = this.colorInput?.value || "#00ff00";

      this.nicknameInput.remove();
      this.colorInput?.remove();

      this.scene.start(SceneKeys.Game, { nickname, color });
      this.scene.launch(SceneKeys.UI);
    });
  }
}
