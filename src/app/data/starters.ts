export type StarterId = "bulbasaur" | "charmander" | "squirtle" | "pikachu" | "eevee";

export type StarterDef = {
  id: StarterId;
  name: string;
  trait: string;
  unlockCostCoins?: number;
  base: {
    maxHp: number;
    atk: number;
    def: number;
  };
};

export const STARTERS: StarterDef[] = [
  {
    id: "bulbasaur",
    name: "Bulbasaur",
    trait: "Steady growth • Heals a bit more on breaks",
    base: { maxHp: 100, atk: 10, def: 14 },
  },
  {
    id: "charmander",
    name: "Charmander",
    trait: "High risk • Big damage, loses more on fails",
    base: { maxHp: 95, atk: 15, def: 10 },
  },
  {
    id: "squirtle",
    name: "Squirtle",
    trait: "Balanced • More forgiving and consistent",
    base: { maxHp: 105, atk: 12, def: 12 },
  },
  {
    id: "pikachu",
    name: "Pikachu",
    trait: "Lucky • Slightly better rewards on wins",
    unlockCostCoins: 80,
    base: { maxHp: 98, atk: 13, def: 11 },
  },
  {
    id: "eevee",
    name: "Eevee",
    trait: "Adaptable • Small bonus XP each focus",
    unlockCostCoins: 120,
    base: { maxHp: 102, atk: 12, def: 12 },
  },
];

export const byId = (id: StarterId) => {
  const s = STARTERS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown starter: ${id}`);
  return s;
};
