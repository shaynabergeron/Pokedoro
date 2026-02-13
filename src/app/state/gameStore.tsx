import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { GameState } from "./gameTypes";
import { gameReducer, initialState, type GameAction } from "./gameReducer";
import { loadState, saveState } from "./storage";

type GameCtx = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const Ctx = createContext<GameCtx | null>(null);

export function GameStoreProvider({ children }: { children: React.ReactNode }) {
  const persisted = loadState();
  const [state, dispatch] = useReducer(gameReducer, persisted ?? initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGameStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGameStore must be used within GameStoreProvider");
  return v;
}
