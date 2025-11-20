import { Card } from './card.model';

export type TroopAction = 'moving' | 'attacking' | 'idle' | 'dying';
export type Team = 'player' | 'enemy';

export interface Position {
  x: number;
  y: number;
}

export interface Troop {
  id: number;
  card: Card;
  team: Team;
  position: Position;
  hp: number;
  targetId: string | number | null;
  attackCooldown: number;   // frames até o próximo ataque
  action: TroopAction;
  deathCooldown?: number;   // frames até ser removido da arena após morrer
}

export interface SpellEffect {
  id: number;
  card: Card;               // hoje você usa Card inteiro; futuramente dá pra restringir só pra Feitiço
  team: Team;
  position: Position;
  life: number;             // frames até desaparecer
}
