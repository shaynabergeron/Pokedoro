import type { GameState, Pokemon } from "./gameTypes";
import type { StarterId } from "../data/starters";
import { byId, STARTERS } from "../data/starters";
import type { ItemId } from "../data/items";
import { byItemId } from "../data/items";

type Action =
  | { type: "RESET" }
  | { type: "NAV"; phase: GameState["phase"] }
  | { type: "START_SESSION"; starterId: StarterId; nickname?: string }
  | { type: "COMPLETE_FOCUS"; reason?: string }
  | { type: "FAIL_FOCUS"; reason?: string }
  | { type: "APPLY_ITEM"; itemId: ItemId }
  | { type: "BATTLE_END"; won: boolean; rewardXp: number; rewardCoins: number; hpDelta: number }
  | { type: "UPDATE_SETTINGS"; patch: Partial<GameState["settings"]> }
  | { type: "SHOP_BUY_ITEM"; itemId: ItemId; qty: number }
  | { type: "SHOP_UNLOCK_STARTER"; starterId: StarterId };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function xpToNext(level: number) {
  return 50 + (level - 1) * 25;
}

function maybeLevelUp(p: Pokemon): Pokemon {
  let xp = p.xp;
  let level = p.level;
  let { maxHp, atk, def } = p;
  while (xp >= xpToNext(level)) {
    xp -= xpToNext(level);
    level += 1;
    maxHp += 5;
    atk += 1;
    def += 1;
  }
  return { ...p, xp, level, maxHp, hp: clamp(p.hp + 5, 0, maxHp) };
}

function applyStarterTraitXp(p: Pokemon, baseXp: number) {
  // Bulbasaur: tiny focus XP bonus already covered via heal; Eevee: small XP bonus
  if (p.starterId === "eevee") return baseXp + 6;
  return baseXp;
}

function trainerMaybeLevelUp(totalPomodoros: number) {
  // simple: trainer level increases every 10 pomodoros
  return 1 + Math.floor(totalPomodoros / 10);
}

export const initialState: GameState = {
  phase: "splash",
  activePokemon: null,
  inventory: {
    oran_berry: 2,
    rare_candy: 1,
    soda_pop: 1,
    protein: 0,
    pokeblock: 0,
  },
  trainer: {
    level: 1,
    coins: 0,
    totalPomodoros: 0,
    bestStreak: 0,
    currentStreak: 0,
    pomodorosInSet: 0,
    unlockedStarters: {
      bulbasaur: true,
      charmander: true,
      squirtle: true,
      pikachu: false,
      eevee: false,
    },
  },
  settings: {
    focusMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    strictFocus: true,
    sound: true,
    notifications: true,
  },
  lastSessionResult: null,
};

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "RESET":
      return initialState;

    case "NAV":
      return { ...state, phase: action.phase };

    case "START_SESSION": {
      const s = byId(action.starterId);
      const p: Pokemon = {
        starterId: s.id,
        nickname: action.nickname ?? s.name,
        level: 1,
        xp: 0,
        maxHp: s.base.maxHp,
        hp: s.base.maxHp,
        hunger: 20,
        happiness: 60,
        atk: s.base.atk,
        def: s.base.def,
        mood: "idle",
      };
      return {
        ...state,
        phase: "focus",
        activePokemon: p,
        lastSessionResult: null,
      };
    }

    case "COMPLETE_FOCUS": {
      if (!state.activePokemon) return state;

      const baseCoins = 10;
      const baseXp = 50;

      // Starter traits
      let coinsBonus = 0;
      if (state.activePokemon.starterId === "pikachu") coinsBonus = 2; // lucky
      const xpGained = applyStarterTraitXp(state.activePokemon, baseXp);
      const coinsGained = baseCoins + coinsBonus;

      let p = { ...state.activePokemon };
      p.xp += xpGained;
      p.hunger = clamp(p.hunger + 10, 0, 100);
      p.happiness = clamp(p.happiness + 2, 0, 100);
      p.mood = "happy";
      p = maybeLevelUp(p);

      const trainer = { ...state.trainer };
      trainer.totalPomodoros += 1;
      trainer.currentStreak += 1;
      trainer.bestStreak = Math.max(trainer.bestStreak, trainer.currentStreak);
      trainer.coins += coinsGained;

      // pomodoro sets -> long break after 4th completed
      trainer.pomodorosInSet = (trainer.pomodorosInSet + 1) % 4;
      const usedLongBreakNext = trainer.pomodorosInSet === 0;

      trainer.level = trainerMaybeLevelUp(trainer.totalPomodoros);

      // Long break reward
      if (usedLongBreakNext) {
        trainer.coins += 8;
      }

      return {
        ...state,
        phase: "summary",
        activePokemon: p,
        trainer,
        lastSessionResult: {
          xpGained,
          coinsGained: coinsGained + (usedLongBreakNext ? 8 : 0),
          completed: true,
          usedLongBreakNext,
          message: action.reason,
        },
      };
    }

    case "FAIL_FOCUS": {
      if (!state.activePokemon) return state;

      const penalty = state.activePokemon.starterId === "charmander" ? 20 : 12;
      let p = { ...state.activePokemon };
      p.hp = clamp(p.hp - penalty, 0, p.maxHp);
      p.happiness = clamp(p.happiness - 10, 0, 100);
      p.mood = "sad";

      const trainer = { ...state.trainer, currentStreak: 0, pomodorosInSet: 0 };

      return {
        ...state,
        phase: "summary",
        activePokemon: p,
        trainer,
        lastSessionResult: {
          xpGained: 0,
          coinsGained: 0,
          completed: false,
          usedLongBreakNext: false,
          message: action.reason,
        },
      };
    }

    case "APPLY_ITEM": {
      if (!state.activePokemon) return state;
      const count = state.inventory[action.itemId] ?? 0;
      if (count <= 0) return state;

      const inv = { ...state.inventory, [action.itemId]: count - 1 };
      let p = { ...state.activePokemon };

      if (action.itemId === "oran_berry") {
        const healBoost = p.starterId === "bulbasaur" ? 3 : 0;
        p.hp = clamp(p.hp + 10 + healBoost, 0, p.maxHp);
        p.hunger = clamp(p.hunger - 10, 0, 100);
        p.mood = "happy";
      } else if (action.itemId === "rare_candy") {
        p.xp += 20;
        p = maybeLevelUp(p);
        p.mood = "happy";
      } else if (action.itemId === "soda_pop") {
        p.happiness = clamp(p.happiness + 10, 0, 100);
        p.mood = "happy";
      } else if (action.itemId === "protein") {
        p.atk += 1;
        p.mood = "happy";
      } else if (action.itemId === "pokeblock") {
        p.hunger = clamp(p.hunger - 25, 0, 100);
        p.happiness = clamp(p.happiness + 5, 0, 100);
        p.mood = "happy";
      }

      return { ...state, inventory: inv, activePokemon: p };
    }

    case "BATTLE_END": {
      if (!state.activePokemon) return state;

      const trainer = { ...state.trainer };
      let p = { ...state.activePokemon };

      p.hp = clamp(p.hp + action.hpDelta, 0, p.maxHp);
      if (action.won) {
        trainer.coins += action.rewardCoins;
        p.xp += action.rewardXp;
        p.happiness = clamp(p.happiness + 3, 0, 100);
        p = maybeLevelUp(p);
        p.mood = "happy";
      } else {
        p.happiness = clamp(p.happiness - 5, 0, 100);
        p.mood = "sad";
      }

      return { ...state, trainer, activePokemon: p };
    }

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case "SHOP_BUY_ITEM": {
      const it = byItemId(action.itemId);
      const cost = (it.costCoins ?? 0) * action.qty;
      if (cost <= 0) return state;
      if (state.trainer.coins < cost) return state;

      const inv = { ...state.inventory };
      inv[action.itemId] = (inv[action.itemId] ?? 0) + action.qty;

      return { ...state, inventory: inv, trainer: { ...state.trainer, coins: state.trainer.coins - cost } };
    }

    case "SHOP_UNLOCK_STARTER": {
      if (state.trainer.unlockedStarters[action.starterId]) return state;
      const def = STARTERS.find((s) => s.id === action.starterId);
      const cost = def?.unlockCostCoins ?? 0;
      if (cost <= 0) return state;
      if (state.trainer.coins < cost) return state;

      return {
        ...state,
        trainer: {
          ...state.trainer,
          coins: state.trainer.coins - cost,
          unlockedStarters: { ...state.trainer.unlockedStarters, [action.starterId]: true },
        },
      };
    }

    default:
      return state;
  }
}

export type GameAction = Action;
