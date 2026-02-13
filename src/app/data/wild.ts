export type WildId = "rattata" | "pidgey" | "meowth" | "eevee" | "growlithe";

export type WildDef = {
  id: WildId;
  name: string;
  hp: number;
  atk: number;
  def: number;
  minStreak: number;
  rewardCoins: number;
  rewardXp: number;
};

export const WILD: WildDef[] = [
  { id: "rattata", name: "Rattata", hp: 40, atk: 8, def: 6, minStreak: 0, rewardCoins: 4, rewardXp: 10 },
  { id: "pidgey", name: "Pidgey", hp: 45, atk: 7, def: 7, minStreak: 0, rewardCoins: 4, rewardXp: 10 },
  { id: "meowth", name: "Meowth", hp: 55, atk: 9, def: 9, minStreak: 2, rewardCoins: 7, rewardXp: 14 },
  { id: "eevee", name: "Eevee", hp: 60, atk: 10, def: 9, minStreak: 4, rewardCoins: 10, rewardXp: 18 },
  { id: "growlithe", name: "Growlithe", hp: 70, atk: 12, def: 9, minStreak: 6, rewardCoins: 12, rewardXp: 22 },
];

export function getWildEncounter(streak: number): WildDef {
  const pool = WILD.filter((w) => streak >= w.minStreak);
  return pool[Math.floor(Math.random() * pool.length)];
}
