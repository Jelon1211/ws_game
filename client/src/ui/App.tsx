import { useRef, useState } from "react";
import { Game } from "../game/Game";
import { assets } from "../assets/manifest";
import { GameView } from "./GameView";

const shipUrl = assets.images.find((img) => img.key === "player_ship")?.url;

export function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [color, setColor] = useState<string>("#22c55e");

  const gameRef = useRef<Game | null>(null);

  const startGame = () => {
    if (!nickname.trim()) return;

    if (!gameRef.current) {
      gameRef.current = new Game({
        nickname,
        color,
      });
    }

    setGameStarted(true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          gameStarted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <GameView />
      </div>

      {!gameStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
            <h1 className="text-3xl font-bold text-center mb-6">
              🎮 Join the Game
            </h1>

            <div className="mb-5">
              <label className="block text-sm mb-2 text-slate-300">
                Nickname
              </label>
              <input
                type="text"
                placeholder="Enter nickname..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-slate-300">
                Player Color
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 p-1 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer"
                />

                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-2">
                    Ship Preview:
                  </div>

                  <div className="relative w-full h-24 flex items-center justify-center bg-slate-800 rounded-lg border border-slate-600 overflow-hidden">
                    <div
                      className="h-16 w-16"
                      style={{
                        backgroundColor: color,
                        WebkitMaskImage: `url(${shipUrl})`,
                        maskImage: `url(${shipUrl})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              disabled={!nickname.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition-all
                ${
                  nickname.trim()
                    ? "bg-green-500 cursor-pointer hover:bg-green-600 active:scale-95"
                    : "bg-slate-600 cursor-not-allowed"
                }
              `}
            >
              Join Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
