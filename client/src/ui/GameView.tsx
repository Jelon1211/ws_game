import { useGameStore } from "../store/useGameStore";
import { bus } from "../utils/eventBus";
import { GameContainer } from "./components/GameComponent";

export function GameView() {
  const { score } = useGameStore();

  bus.on("*", (event) => {
    console.log(event);
  });

  return (
    <div className="grid h-screen w-screen grid-rows-[auto_1fr_auto] grid-cols-[250px_1fr_250px]">
      {/* TOP BAR */}
      <div className="col-span-3 border-b border-white bg-red-200">TOP</div>

      {/* LEFT */}
      <div className="border-r border-white bg-blue-200">{score}</div>

      {/* GAME (Phaser) */}
      <GameContainer />

      {/* RIGHT */}
      <div className="border-l border-white bg-blue-200">RIGHT UI</div>

      {/* BOTTOM */}
      <div className="col-span-3 border-t border-white bg-green-200">
        BOTTOM
      </div>
    </div>
  );
}
