import { type Game, GameDefault } from "./Game.ts";
import { createContext, useContext } from "react";

export const GameCtx = createContext<Game>(new GameDefault());

export const useGame = () => {
  return useContext(GameCtx);
};
