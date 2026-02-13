import type { StarterId } from "../data/starters";
import type { ItemId } from "../data/items";

export type Phase = "splash" | "starter" | "focus" | "summary" | "break";

export type PokemonMood = "idle" | "happy" | "sad" | "tired";

export type Pokemon = {
  starterId: StarterId;
  nickname: string;
  level: number;
  xp: number;

  hp: number;
  maxHp: number;

  hunger: number;     // 0..100 (higher = hungrier)
  happiness: number;  // 0..100

  atk: number;
  def: number;

  mood: PokemonMood;
};

export type Inventory = Record<ItemId, number>;

export type Trainer = {
  level: number;
  coins: number;
  totalPomodoros: number;
  bestStreak: number;
  currentStreak: number;
  pomodorosInSet: number; // 0..3 (long break after 4th)
  unlockedStarters: Record<StarterId, boolean>;
};

export type Settings = {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  strictFocus: boolean; // if true: leaving tab fails session
  sound: boolean;
  notifications: boolean;
};

export type GameState = {
  phase: Phase;
  activePokemon: Pokemon | null;
  inventory: Inventory;
  trainer: Trainer;
  settings: Settings;
  lastSessionResult: null | {
    xpGained: number;
    coinsGained: number;
    completed: boolean;
    usedLongBreakNext: boolean;
    message?: string;
  };
};
