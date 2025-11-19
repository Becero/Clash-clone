import { ChangeDetectionStrategy, Component, computed, effect, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { Card } from '../../models/card.model';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { TroopComponent } from '../troop/troop.component';

export interface Troop {
  id: number;
  card: Card;
  position: { x: number; y: number };
  hp: number;
  targetKey: 'left' | 'right' | 'king' | null;
  attackCooldown: number; // frames until next attack
}

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  imports: [CommonModule, CardComponent, TroopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaComponent implements OnInit, OnDestroy {
  deck = input.required<(Card | null)[]>();
  exit = output<void>();

  // Game State
  elixir = signal(5);
  displayElixir = computed(() => Math.floor(this.elixir()));
  playerHand = signal<Card[]>([]);
  activeTroops = signal<Troop[]>([]);
  selectedCardIndex = signal<number | null>(null);
  gameStatus = signal<'playing' | 'win' | 'lose'>('playing');

  // Tower HP and Positions
  readonly TOWER_MAX_HP = { king: 2500, princess: 1400 };
  readonly ARENA_WIDTH = 540; // Corresponds to max-w-2xl and aspect ratio, adjusted for gameplay
  readonly ARENA_HEIGHT = 720;
  
  TOWER_POSITIONS: any;

  towerHP = signal({
    enemy: { king: this.TOWER_MAX_HP.king, left: this.TOWER_MAX_HP.princess, right: this.TOWER_MAX_HP.princess },
    player: { king: this.TOWER_MAX_HP.king, left: this.TOWER_MAX_HP.princess, right: this.TOWER_MAX_HP.princess },
  });
  towerFlashing = signal({ // For damage flash effect
    enemy: { king: false, left: false, right: false }
  });


  // Internals
  private deckCards: Card[] = [];
  private drawPile: Card[] = [];
  private elixirInterval: any;
  private gameLoop: any;
  private nextTroopId = 0;

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
      }
    }, 200);
  }

  selectCard(card: Card, index: number): void {
    if (this.elixir() >= card.elixirCost && this.gameStatus() === 'playing') {
      this.selectedCardIndex.set(index);
    }
  }

  placeTroopOnArena(event: MouseEvent): void {
    const selectedCardIndex = this.selectedCardIndex();
    if (selectedCardIndex === null) return;
    
    const cardToPlay = this.playerHand()[selectedCardIndex];
    if (this.elixir() < cardToPlay.elixirCost || cardToPlay.type !== 'Tropa') {
      this.selectedCardIndex.set(null);
      return;
    }

    const arenaEl = event.currentTarget as HTMLElement;
    const rect = arenaEl.getBoundingClientRect();
    const y = (event.clientY - rect.top) / rect.height * this.ARENA_HEIGHT;

    if (y < rect.height / 2) {
      this.selectedCardIndex.set(null);
      return;
    }

    this.elixir.update(e => e - cardToPlay.elixirCost);
    const x = (event.clientX - rect.left) / rect.width * this.ARENA_WIDTH;
    const targetKey = this.determineTarget(x);
    if (!targetKey) return;

    this.activeTroops.update(troops => [
      ...troops,
      { 
        id: this.nextTroopId++, 
        card: cardToPlay, 
        position: { x, y },
        hp: cardToPlay.hp!,
        targetKey: targetKey,
        attackCooldown: 0,
      }
    ]);

    this.playerHand.update(hand => {
      const newHand = [...hand];
      newHand[selectedCardIndex] = this.drawCardFromPile();
      return newHand;
    });

    this.selectedCardIndex.set(null);
  }

  determineTarget(x: number): 'left' | 'right' | 'king' | null {
    const enemyTowers = this.towerHP().enemy;
    const isLeftDestroyed = enemyTowers.left <= 0;
    const isRightDestroyed = enemyTowers.right <= 0;

    if (isLeftDestroyed && isRightDestroyed) return 'king';

    if (x < this.ARENA_WIDTH / 2) {
      return !isLeftDestroyed ? 'left' : 'right';
    } else {
      return !isRightDestroyed ? 'right' : 'left';
    }
  }

  gameTick(): void {
    if (this.gameStatus() !== 'playing') return;

    this.activeTroops.update(troops => troops.map(troop => {
      if (!troop.targetKey) return troop;

      const targetPosition = this.TOWER_POSITIONS.enemy[troop.targetKey];
      const dx = targetPosition.x - troop.position.x;
      const dy = targetPosition.y - troop.position.y;
      const distance = Math.hypot(dx, dy);

      const range = troop.card.range || 50;
      const speed = troop.card.speed || 2;

      if (distance <= range) {
        let newCooldown = troop.attackCooldown - 1;
        if (newCooldown <= 0) {
          this.dealDamageToTower(troop.targetKey, troop.card.damage || 10);
          newCooldown = (troop.card.attackSpeed || 1) * 30; // seconds * fps
        }
        return { ...troop, attackCooldown: newCooldown };
      } else {
        const newX = troop.position.x + (dx / distance) * speed;
        const newY = troop.position.y + (dy / distance) * speed;
        return { ...troop, position: { x: newX, y: newY } };
      }
    }));

    this.activeTroops.update(troops => troops.map(troop => {
        if (troop.targetKey && this.towerHP().enemy[troop.targetKey] <= 0) {
            const newTarget = this.determineTarget(troop.position.x);
            return { ...troop, targetKey: newTarget };
        }
        return troop;
    }));

    if (this.towerHP().enemy.king <= 0) {
      this.gameStatus.set('win');
      clearInterval(this.gameLoop);
    }
  }
  
  dealDamageToTower(target: 'left' | 'right' | 'king', damage: number) {
    this.towerHP.update(hp => {
      const newHpState = structuredClone(hp);
      newHpState.enemy[target] = Math.max(0, newHpState.enemy[target] - damage);
      return newHpState;
    });

    this.towerFlashing.update(current => {
      const next = { ...current, enemy: { ...current.enemy, [target]: true } };
      return next;
    });

    setTimeout(() => {
      this.towerFlashing.update(current => {
        const next = { ...current, enemy: { ...current.enemy, [target]: false } };
        return next;
      });
    }, 300);
  }
}