
export interface Card {
  id: string;
  name: string;
  type: 'Tropa' | 'Feitiço' | 'Construção';
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
  elixirCost: number;
  imageUrl: string;
  description: string;
  // Combat stats
  hp?: number;
  damage?: number;
  attackSpeed?: number; // in seconds
  speed?: number; // in pixels per frame
  range?: number; // in pixels
}