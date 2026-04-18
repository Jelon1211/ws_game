import { useGameStore } from "./useGameStore";

export class StoreDispatcher {
  public setScore(score: number) {
    useGameStore.getState().setScore(score);
  }
}

export const storeDispatcher = new StoreDispatcher();
