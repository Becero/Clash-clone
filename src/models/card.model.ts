export type CardType = 'Tropa' | 'Feitiço' | 'Construção'; 
export type Rarity = 'Comum' | 'Heroico' | 'Divino';
export type TargetsType = 'Terrestre' | 'Aéreo e Terrestre' | 'Construções';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  elixirCost: number;

  imageUrl: string;
  troopImageUrl?: string;

  description: string;

  // Stats de combate (dependem do tipo)
  hp?: number;
  damage?: number;
  attackSpeed?: number;  // em segundos
  speed?: number;        // em pixels por frame (no seu loop 30fps)
  range?: number;        // em pixels
  targets?: TargetsType;

  // Propriedades especiais
  count?: number;        // tamanho de horda
  radius?: number;       // raio de feitiço / área

  // Para UI
  displayStats?: Record<string, string | number>;
}
