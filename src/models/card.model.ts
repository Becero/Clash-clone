
export interface Card {
  id: string;
  name: string;
  type: 'Tropa' | 'Feitiço' | 'Construção';
  rarity: 'Comum' | 'Heroico' | 'Divino';
  elixirCost: number;
  imageUrl: string;
  troopImageUrl?: string;
  description: string;
  // Combat stats
  hp?: number;
  damage?: number;
  attackSpeed?: number; // in seconds
  speed?: number; // in pixels per frame
  range?: number; // in pixels
  // Special properties
  count?: number; // For swarm troops
  radius?: number; // For spell effects
}