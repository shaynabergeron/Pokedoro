export type ItemId =
  | "oran_berry"
  | "rare_candy"
  | "soda_pop"
  | "protein"
  | "pokeblock";

export type ItemDef = {
  id: ItemId;
  name: string;
  desc: string;
  costCoins?: number; // shop price
};

export const ITEMS: ItemDef[] = [
  { id: "oran_berry", name: "Oran Berry", desc: "+10 HP, -10 Hunger", costCoins: 10 },
  { id: "rare_candy", name: "Rare Candy", desc: "+20 XP", costCoins: 25 },
  { id: "soda_pop", name: "Soda Pop", desc: "+10 Happiness", costCoins: 12 },
  { id: "protein", name: "Protein", desc: "+1 ATK (permanent)", costCoins: 60 },
  { id: "pokeblock", name: "Pokéblock", desc: "-25 Hunger, +5 Happiness", costCoins: 18 },
];

export const itemName = (id: ItemId) => ITEMS.find((x) => x.id === id)?.name ?? id;
export const byItemId = (id: ItemId) => {
  const it = ITEMS.find((x) => x.id === id);
  if (!it) throw new Error(`Unknown item: ${id}`);
  return it;
};
