import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { Card } from '../../models/card.model';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { TroopComponent } from '../troop/troop.component';
import { CardService } from '../../services/card.service';

export interface Troop {
  id: number;
  card: Card;
  team: 'player' | 'enemy';
  position: { x: number; y: number };
  hp: number;
  targetId: string | number | null; // Can be tower key ('player-king') or troop id (number)
  attackCooldown: number; // frames until next attack
}

export interface SpellEffect {
  id: number;
  card: Card;
  team: 'player' | 'enemy';
  position: { x: number; y: number };
  life: number; // frames until it disappears
}

// FIX: Define helper types for position and tower map for strong typing.
type Position = { x: number; y: number };
type TowerPositionsMap = {
  [team in 'player' | 'enemy']: {
    [tower in 'king' | 'left' | 'right']: Position;
  };
};

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  imports: [CommonModule, CardComponent, TroopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaComponent implements OnInit, OnDestroy {
  deck = input.required<(Card | null)[]>();
  exit = output<void>();
  private cardService = inject(CardService);

  // Game State
  elixir = signal(5);
  enemyElixir = signal(5);
  displayElixir = computed(() => Math.floor(this.elixir()));
  playerHand = signal<Card[]>([]);
  activeTroops = signal<Troop[]>([]);
  spellEffects = signal<SpellEffect[]>([]);
  selectedCardIndex = signal<number | null>(null);
  gameStatus = signal<'playing' | 'win' | 'lose'>('playing');

  // Tower Constants & Positions
  readonly TOWER_MAX_HP = { king: 2500, princess: 1400 };
  readonly ARENA_WIDTH = 540; 
  readonly ARENA_HEIGHT = 720;
  readonly TOWER_RANGE = 220;
  readonly TOWER_ATTACK_SPEED = 1 * 30; // 1 attack per second in frames
  readonly TOWER_DAMAGE = 80;
  
  // FIX: Use the strongly typed TowerPositionsMap instead of `any`.
  TOWER_POSITIONS: TowerPositionsMap;

  towerHP = signal({
    enemy: { king: this.TOWER_MAX_HP.king, left: this.TOWER_MAX_HP.princess, right: this.TOWER_MAX_HP.princess },
    player: { king: this.TOWER_MAX_HP.king, left: this.TOWER_MAX_HP.princess, right: this.TOWER_MAX_HP.princess },
  });
  towerFlashing = signal({
    enemy: { king: false, left: false, right: false },
    player: { king: false, left: false, right: false },
  });
  towerAttackCooldowns = signal({
    player: { king: 0, left: 0, right: 0 },
    enemy: { king: 0, left: 0, right: 0 }
  });


  // Internals
  private deckCards: Card[] = [];
  private drawPile: Card[] = [];
  private enemyDeck: Card[] = [];
  private aiActionCooldown = 0;
  private elixirInterval: any;
  private gameLoop: any;
  private nextTroopId = 0;
  private nextSpellId = 0;

  constructor() {
    this.TOWER_POSITIONS = {
      enemy: {
        king: { x: this.ARENA_WIDTH / 2, y: 100 },
        left: { x: this.ARENA_WIDTH * 0.20, y: 220 },
        right: { x: this.ARENA_WIDTH * 0.80, y: 220 },
      },
      player: {
         king: { x: this.ARENA_WIDTH / 2, y: this.ARENA_HEIGHT - 100 },
         left: { x: this.ARENA_WIDTH * 0.20, y: this.ARENA_HEIGHT - 220 },
         right: { x: this.ARENA_WIDTH * 0.80, y: this.ARENA_HEIGHT - 220 },
      }
    };

    effect(() => {
      if (this.selectedCardIndex() !== null) {
        document.body.style.cursor = 'copy';
      } else {
        document.body.style.cursor = 'default';
      }
    });
  }

  ngOnInit(): void {
    this.deckCards = this.deck().filter((c): c is Card => !!c);
    this.enemyDeck = this.cardService.getCards().filter(c => c.type === 'Tropa'); // AI only uses troops for simplicity
    this.shuffleDeck();
    this.drawInitialHand();
    this.startElixirGeneration();
    this.gameLoop = setInterval(() => this.gameTick(), 1000 / 30); // ~30 FPS
  }

  ngOnDestroy(): void {
    clearInterval(this.elixirInterval);
    clearInterval(this.gameLoop);
    document.body.style.cursor = 'default';
  }

  private shuffleDeck(): void {
    let cards = [...this.deckCards];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    this.drawPile = cards;
  }

  private drawInitialHand(): void {
    const hand: Card[] = [];
    for (let i = 0; i < 4; i++) {
      hand.push(this.drawCardFromPile());
    }
    this.playerHand.set(hand);
  }

  private drawCardFromPile(): Card {
    if (this.drawPile.length === 0) {
      this.shuffleDeck();
    }
    return this.drawPile.pop()!;
  }

  private startElixirGeneration(): void {
    this.elixirInterval = setInterval(() => {
      if (this.gameStatus() === 'playing') {
        this.elixir.update(e => Math.min(10, e + 0.1));
        this.enemyElixir.update(e => Math.min(10, e + 0.1));
      }
    }, 200);
  }

  selectCard(card: Card, index: number): void {
    if (this.elixir() >= card.elixirCost && this.gameStatus() === 'playing') {
      this.selectedCardIndex.set(index);
    }
  }

  playCardOnArena(event: MouseEvent): void {
    const selectedCardIndex = this.selectedCardIndex();
    if (selectedCardIndex === null) return;
    
    const cardToPlay = this.playerHand()[selectedCardIndex];
    if (this.elixir() < cardToPlay.elixirCost) {
      this.selectedCardIndex.set(null);
      return;
    }

    const arenaEl = event.currentTarget as HTMLElement;
    const rect = arenaEl.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * this.ARENA_WIDTH;
    const y = (event.clientY - rect.top) / rect.height * this.ARENA_HEIGHT;

    if (cardToPlay.type === 'Tropa' && y < this.ARENA_HEIGHT / 2) { // Cannot place troops on enemy side
      this.selectedCardIndex.set(null);
      return;
    }

    // Use elixir
    this.elixir.update(e => e - cardToPlay.elixirCost);

    if (cardToPlay.type === 'Tropa') {
      this.placeTroop(cardToPlay, {x, y}, 'player');
    } else if (cardToPlay.type === 'Feitiço') {
      this.castSpell(cardToPlay, {x, y}, 'player');
    }

    // Cycle card
    this.playerHand.update(hand => {
      const newHand = [...hand];
      newHand[selectedCardIndex] = this.drawCardFromPile();
      return newHand;
    });

    this.selectedCardIndex.set(null);
  }

  placeTroop(card: Card, position: {x: number, y: number}, team: 'player' | 'enemy'): void {
    const count = card.count || 1;
    for(let i = 0; i < count; i++) {
        const offsetX = (Math.random() - 0.5) * 40 * (count > 1 ? 1: 0);
        const offsetY = (Math.random() - 0.5) * 40 * (count > 1 ? 1: 0);
        const troopPosition = { x: position.x + offsetX, y: position.y + offsetY };

        this.activeTroops.update(troops => [
        ...troops,
        { 
            id: this.nextTroopId++, 
            card: card, 
            team: team,
            position: troopPosition,
            hp: card.hp!,
            targetId: null, // Will be found in game tick
            attackCooldown: 0,
        }
        ]);
    }
  }

  castSpell(card: Card, position: {x: number, y: number}, team: 'player' | 'enemy'): void {
    this.spellEffects.update(effects => [
      ...effects,
      { id: this.nextSpellId++, card, position, team, life: 30 } // Lasts 1 second
    ]);

    const targetTeam = team === 'player' ? 'enemy' : 'player';

    // Damage troops
    this.activeTroops.update(troops => troops.map(troop => {
      if (troop.team === targetTeam) {
        const distance = Math.hypot(troop.position.x - position.x, troop.position.y - position.y);
        if (distance <= (card.radius || 0)) {
          return { ...troop, hp: Math.max(0, troop.hp - (card.damage || 0)) };
        }
      }
      return troop;
    }));

    // Damage towers
    Object.keys(this.TOWER_POSITIONS[targetTeam]).forEach(key => {
        const towerKey = key as 'left' | 'right' | 'king';
        const towerPos = this.TOWER_POSITIONS[targetTeam][towerKey];
        const distance = Math.hypot(towerPos.x - position.x, towerPos.y - position.y);
        if (distance <= (card.radius || 0)) {
            this.dealDamageToTower(targetTeam, towerKey, card.damage || 0);
        }
    });
  }

  gameTick(): void {
    if (this.gameStatus() !== 'playing') return;

    // 1. AI Logic
    this.aiActionCooldown--;
    if (this.aiActionCooldown <= 0) {
        this.runAiLogic();
        this.aiActionCooldown = (2 + Math.random() * 2) * 30; // Every 2-4 seconds
    }

    // 2. Cooldowns
    this.towerAttackCooldowns.update(cds => {
        const newCds = structuredClone(cds);
        for (const team of ['player', 'enemy'] as const) {
            for (const tower of ['king', 'left', 'right'] as const) {
                if (newCds[team][tower] > 0) newCds[team][tower]--;
            }
        }
        return newCds;
    });

    // 3. Tower Attacks
    this.handleTowerAttacks('player');
    this.handleTowerAttacks('enemy');

    // 4. Update Troops
    const troops = this.activeTroops();
    const damagesToApply = new Map<string | number, number>();

    const updatedTroops = troops.map(troop => {
        let newTroop = { ...troop };
        if (newTroop.attackCooldown > 0) newTroop.attackCooldown--;

        // Find or validate target
        let targetIsValid = false;
        if (newTroop.targetId !== null) {
            if (typeof newTroop.targetId === 'number') {
                const targetTroop = troops.find(t => t.id === newTroop.targetId);
                targetIsValid = !!targetTroop && targetTroop.hp > 0;
            } else {
                const [team, key] = newTroop.targetId.split('-') as ['player' | 'enemy', 'king' | 'left' | 'right'];
                targetIsValid = this.towerHP()[team][key] > 0;
            }
        }

        if (!targetIsValid) {
            const targetTeam = newTroop.team === 'player' ? 'enemy' : 'player';
            const enemyTroops = troops.filter(t => t.team === targetTeam);
            const potentialTargets = [
                ...enemyTroops.map(t => ({ id: t.id, position: t.position })),
                ...Object.entries(this.TOWER_POSITIONS[targetTeam])
                    .filter(([key]) => this.towerHP()[targetTeam][key as 'king'|'left'|'right'] > 0)
                    .map(([key, pos]) => ({ id: `${targetTeam}-${key}`, position: pos }))
            ];
            
            if (potentialTargets.length > 0) {
                let closest = potentialTargets[0];
                let minDistance = Math.hypot(newTroop.position.x - closest.position.x, newTroop.position.y - closest.position.y);
                for (let i = 1; i < potentialTargets.length; i++) {
                    const dist = Math.hypot(newTroop.position.x - potentialTargets[i].position.x, newTroop.position.y - potentialTargets[i].position.y);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closest = potentialTargets[i];
                    }
                }
                newTroop.targetId = closest.id;
            } else {
                newTroop.targetId = null;
            }
        }
        
        // Move or Attack
        if (newTroop.targetId) {
            // FIX: Properly type and retrieve target position to avoid errors with 'unknown' type.
            let targetPos: Position;
            if (typeof newTroop.targetId === 'number') {
              // The `targetIsValid` check above ensures the troop exists.
              targetPos = troops.find(t => t.id === newTroop.targetId)!.position;
            } else {
              const [team, key] = newTroop.targetId.split('-') as ['player' | 'enemy', 'king' | 'left' | 'right'];
              targetPos = this.TOWER_POSITIONS[team][key];
            }
            
            const dx = targetPos.x - newTroop.position.x;
            const dy = targetPos.y - newTroop.position.y;
            const distance = Math.hypot(dx, dy);
            const range = newTroop.card.range || 50;

            if (distance <= range) {
                if (newTroop.attackCooldown <= 0) {
                    const currentDamage = damagesToApply.get(newTroop.targetId) || 0;
                    damagesToApply.set(newTroop.targetId, currentDamage + (newTroop.card.damage || 0));
                    newTroop.attackCooldown = (newTroop.card.attackSpeed || 1) * 30;
                }
            } else {
                const speed = newTroop.card.speed || 2;
                newTroop.position = {
                    x: newTroop.position.x + (dx / distance) * speed,
                    y: newTroop.position.y + (dy / distance) * speed,
                };
            }
        }
        return newTroop;
    });

    // Apply damages
    damagesToApply.forEach((damage, targetId) => {
        if (typeof targetId === 'string') {
            const [team, key] = targetId.split('-') as ['player' | 'enemy', 'king' | 'left' | 'right'];
            this.dealDamageToTower(team, key, damage);
        }
    });

    const troopsAfterDamage = updatedTroops.map(t => {
        const damage = damagesToApply.get(t.id);
        if (damage) {
            return { ...t, hp: t.hp - damage };
        }
        return t;
    });

    this.activeTroops.set(troopsAfterDamage.filter(t => t.hp > 0));

    // 5. Update spell effects
    this.spellEffects.update(effects => effects.map(e => ({...e, life: e.life - 1})).filter(e => e.life > 0));

    // 6. Check win/loss
    if (this.towerHP().enemy.king <= 0) {
      this.gameStatus.set('win');
      clearInterval(this.gameLoop);
    } else if (this.towerHP().player.king <= 0) {
      this.gameStatus.set('lose');
      clearInterval(this.gameLoop);
    }
  }
  
  runAiLogic(): void {
    const elixir = this.enemyElixir();
    const playableCards = this.enemyDeck.filter(c => c.elixirCost <= elixir);
    if (playableCards.length === 0) return;

    const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
    this.enemyElixir.update(e => e - cardToPlay.elixirCost);

    const x = Math.random() * this.ARENA_WIDTH;
    const y = Math.random() * (this.ARENA_HEIGHT / 2 - 50) + 50; // Place on their side

    if (cardToPlay.type === 'Tropa') {
      this.placeTroop(cardToPlay, {x, y}, 'enemy');
    }
  }

  handleTowerAttacks(team: 'player' | 'enemy'): void {
    const opponentTeam = team === 'player' ? 'enemy' : 'player';
    const opponentTroops = this.activeTroops().filter(t => t.team === opponentTeam);
    if (opponentTroops.length === 0) return;

    const towerPositions = this.TOWER_POSITIONS[team];
    
    Object.keys(towerPositions).forEach(keyStr => {
      const key = keyStr as 'king' | 'left' | 'right';
      if (this.towerHP()[team][key] <= 0 || this.towerAttackCooldowns()[team][key] > 0) return;

      const towerPos = towerPositions[key];
      const troopsInRange = opponentTroops
        .map(troop => ({ troop, distance: Math.hypot(troop.position.x - towerPos.x, troop.position.y - towerPos.y) }))
        .filter(item => item.distance <= this.TOWER_RANGE)
        .sort((a, b) => a.distance - b.distance);

      if (troopsInRange.length > 0) {
        const targetTroop = troopsInRange[0].troop;
        
        this.activeTroops.update(troops => troops.map(t => 
            t.id === targetTroop.id ? { ...t, hp: t.hp - this.TOWER_DAMAGE } : t
        ));

        this.towerAttackCooldowns.update(cds => {
            const newCds = structuredClone(cds);
            newCds[team][key] = this.TOWER_ATTACK_SPEED;
            return newCds;
        });
      }
    });
  }

  dealDamageToTower(team: 'player' | 'enemy', target: 'left' | 'right' | 'king', damage: number) {
    this.towerHP.update(hp => {
      const newHpState = structuredClone(hp);
      newHpState[team][target] = Math.max(0, newHpState[team][target] - damage);
      return newHpState;
    });

    this.towerFlashing.update(current => {
      const newFlashState = structuredClone(current);
      newFlashState[team][target] = true;
      return newFlashState;
    });

    setTimeout(() => {
      this.towerFlashing.update(current => {
        const newFlashState = structuredClone(current);
        newFlashState[team][target] = false;
        return newFlashState;
      });
    }, 300);
  }
}