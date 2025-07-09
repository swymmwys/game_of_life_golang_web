import { Controls } from "./controls/Controls.tsx";
import { GameField } from "./field/GameField.tsx";
import { GameDefault } from "./Game.ts";
import { GameCtx } from "./GameContext.ts";
import { useMemo, useState } from "react";
import { SoundContextProvider } from "./sound/SoundContextProvider.tsx";

function App() {
  const [error, setError] = useState<string | null>(null);

  const GameInst = useMemo(() => {
    const game = new GameDefault();

    game.init(15).catch((err: Error) => {
      setError(err.message);
    });

    return game;
  }, []);

  return (
    <SoundContextProvider>
      <GameCtx.Provider value={GameInst}>
        <Controls />
        <GameField />
        {error}
      </GameCtx.Provider>
    </SoundContextProvider>
  );
}

export default App;
