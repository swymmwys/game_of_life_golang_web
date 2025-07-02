import { Controls } from "./controls/Controls.tsx";
import { GameField } from "./field/GameField.tsx";
import { GameDefault } from "./Game.ts";
import { GameCtx } from "./GameContext.ts";
import { useMemo } from "react";
import { SoundContextProvider } from "./sound/SoundContextProvider.tsx";

function App() {
  const GameInst = useMemo(() => {
    const game = new GameDefault();

    void game.init(15);

    return game;
  }, []);

  return (
    <SoundContextProvider>
      <GameCtx.Provider value={GameInst}>
        <Controls />
        <GameField />
      </GameCtx.Provider>
    </SoundContextProvider>
  );
}

export default App;
