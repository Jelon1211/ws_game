import Phaser from "phaser";
import { SceneKeys } from "../constants/SceneKeys";
import { formatNumber } from "../utils/helpers";

export class UIScene extends Phaser.Scene {
  private scoreText?: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.UI);
  }

  create(): void {
    this.createScoreText();

    console.log("🧩 UI ready");
  }

  private createScoreText(): void {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "20px",
      color: "#000",
    });

    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(1000);
  }

  public setScore(score: number): void {
    if (!this.scoreText) {
      return;
    }

    this.scoreText.setText(`Score: ${formatNumber(score)}`);
  }
}
