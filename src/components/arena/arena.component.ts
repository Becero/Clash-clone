import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card.model';
import { CardComponent } from '../card/card.component';
import { TroopComponent } from '../troop/troop.component';
import { CardService } from '../../services/card.service';
import { SpellEffect, Troop } from '../../models/arena.model';

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

  // Estado
  elixir = signal(5);
  enemyElixir = signal(5);
  displayElixir = computed(() => Math.floor(this.elixir()));
  playerHand = signal<Card[]>([]);
  activeTroops = signal<Troop[]>([]);
  spellEffects = signal<SpellEffect[]>([]);
  selectedCardIndex = signal<number | null>(null);
  gameStatus = signal<'playing' | 'win' | 'lose'>('playing');

  // "Mundo lógico" da arena
  readonly TOWER_MAX_HP = { king: 2500, princess: 1400 };
  readonly ARENA_WIDTH = 540;
  readonly ARENA_HEIGHT = 720;
  readonly TOWER_RANGE = 220;
  readonly TOWER_ATTACK_SPEED = 1 * 30;
  readonly TOWER_DAMAGE = 80;

  TOWER_POSITIONS: TowerPositionsMap;

  towerHP = signal({
    enemy: {
      king: this.TOWER_MAX_HP.king,
      left: this.TOWER_MAX_HP.princess,
      right: this.TOWER_MAX_HP.princess,
    },
    player: {
      king: this.TOWER_MAX_HP.king,
      left: this.TOWER_MAX_HP.princess,
      right: this.TOWER_MAX_HP.princess,
    },
  });

  towerFlashing = signal({
    enemy: { king: false, left: false, right: false },
    player: { king: false, left: false, right: false },
  });

  towerAttackCooldowns = signal({
    player: { king: 0, left: 0, right: 0 },
    enemy: { king: 0, left: 0, right: 0 },
  });

  // Internos
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
        left: { x: this.ARENA_WIDTH * 0.2, y: 220 },
        right: { x: this.ARENA_WIDTH * 0.8, y: 220 },
      },
      player: {
        king: { x: this.ARENA_WIDTH / 2, y: this.ARENA_HEIGHT - 100 },
        left: { x: this.ARENA_WIDTH * 0.2, y: this.ARENA_HEIGHT - 220 },
        right: { x: this.ARENA_WIDTH * 0.8, y: this.ARENA_HEIGHT - 220 },
      },
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
    this.enemyDeck = this.cardService
      .getCards()
      .filter((c) => c.type === 'Tropa');

    this.shuffleDeck();
    this.drawInitialHand();
    this.startElixirGeneration();

    this.gameLoop = setInterval(() => this.gameTick(), 1000 / 30);
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
        this.elixir.update((e) => Math.min(10, e + 0.1));
        this.enemyElixir.update((e) => Math.min(10, e + 0.1));
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

    // Converte click de px da tela para sistema 540x720
    const x = ((event.clientX - rect.left) / rect.width) * this.ARENA_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * this.ARENA_HEIGHT;

    if (cardToPlay.type === 'Tropa' && y < this.ARENA_HEIGHT / 2) {
      this.selectedCardIndex.set(null);
      return;
    }

    this.elixir.update((e) => e - cardToPlay.elixirCost);

    if (cardToPlay.type === 'Tropa') {
      this.placeTroop(cardToPlay, { x, y }, 'player');
    } else if (cardToPlay.type === 'Feitiço') {
      this.castSpell(cardToPlay, { x, y }, 'player');
    }

    this.playerHand.update((hand) => {
      const newHand = [...hand];
      newHand[selectedCardIndex] = this.drawCardFromPile();
      return newHand;
    });

    this.selectedCardIndex.set(null);
  }

  placeTroop(card: Card, position: Position, team: 'player' | 'enemy'): void {
    const count = card.count || 1;
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 40 * (count > 1 ? 1 : 0);
      const offsetY = (Math.random() - 0.5) * 40 * (count > 1 ? 1 : 0);
      const troopPosition = {
        x: position.x + offsetX,
        y: position.y + offsetY,
      };

      this.activeTroops.update((troops) => [
        ...troops,
        {
          id: this.nextTroopId++,
          card,
          team,
          position: troopPosition,
          hp: card.hp!,
          targetId: null,
          attackCooldown: 0,
          action: 'moving',
        },
      ]);
    }
  }

  castSpell(card: Card, position: Position, team: 'player' | 'enemy'): void {
    this.spellEffects.update((effects) => [
      ...effects,
      { id: this.nextSpellId++, card, position, team, life: 30 },
    ]);

    const targetTeam = team === 'player' ? 'enemy' : 'player';

    this.activeTroops.update((troops) =>
      troops.map((troop) => {
        if (troop.team === targetTeam) {
          const distance = Math.hypot(
            troop.position.x - position.x,
            troop.position.y - position.y
          );
          if (distance <= (card.radius || 0)) {
            return {
              ...troop,
              hp: Math.max(0, troop.hp - (card.damage || 0)),
            };
          }
        }
        return troop;
      })
    );

    Object.keys(this.TOWER_POSITIONS[targetTeam]).forEach((key) => {
      const towerKey = key as 'left' | 'right' | 'king';
      const towerPos = this.TOWER_POSITIONS[targetTeam][towerKey];
      const distance = Math.hypot(
        towerPos.x - position.x,
        towerPos.y - position.y
      );
      if (distance <= (card.radius || 0)) {
        this.dealDamageToTower(targetTeam, towerKey, card.damage || 0);
      }
    });
  }

  private gameTick(): void {
    if (this.gameStatus() !== 'playing') return;

    this.runAiLogic();
    this.updateCooldowns();

    const damagesToApply = new Map<string | number, number>();

    this.handleTowerAttacks('player', damagesToApply);
    this.handleTowerAttacks('enemy', damagesToApply);

    const updatedTroops = this.updateTroops(damagesToApply);
    this.applyDamagesAndHandleDeaths(updatedTroops, damagesToApply);

    this.spellEffects.update((effects) =>
      effects
        .map((e) => ({ ...e, life: e.life - 1 }))
        .filter((e) => e.life > 0)
    );

    this.checkGameEndConditions();
  }

  private runAiLogic(): void {
    this.aiActionCooldown--;
    if (this.aiActionCooldown > 0) return;

    this.aiActionCooldown = (2 + Math.random() * 2) * 30;

    const elixir = this.enemyElixir();
    const playableCards = this.enemyDeck.filter(
      (c) => c.elixirCost <= elixir
    );
    if (playableCards.length === 0) return;

    const cardToPlay =
      playableCards[Math.floor(Math.random() * playableCards.length)];
    this.enemyElixir.update((e) => e - cardToPlay.elixirCost);

    const x = Math.random() * this.ARENA_WIDTH;
    const y =
      Math.random() * (this.ARENA_HEIGHT / 2 - 50) + 50;

    if (cardToPlay.type === 'Tropa') {
      this.placeTroop(cardToPlay, { x, y }, 'enemy');
    }
  }

  private updateCooldowns(): void {
    this.towerAttackCooldowns.update((cds) => {
      const newCds = structuredClone(cds);
      for (const team of ['player', 'enemy'] as const) {
        for (const tower of ['king', 'left', 'right'] as const) {
          if (newCds[team][tower] > 0) newCds[team][tower]--;
        }
      }
      return newCds;
    });
  }

  private handleTowerAttacks(
    team: 'player' | 'enemy',
    damages: Map<string | number, number>
  ): void {
    const opponentTeam = team === 'player' ? 'enemy' : 'player';
    const opponentTroops = this.activeTroops().filter(
      (t) => t.team === opponentTeam && t.action !== 'dying'
    );
    if (opponentTroops.length === 0) return;

    const towerPositions = this.TOWER_POSITIONS[team];

    Object.keys(towerPositions).forEach((keyStr) => {
      const key = keyStr as 'king' | 'left' | 'right';
      if (this.towerHP()[team][key] <= 0 ||
          this.towerAttackCooldowns()[team][key] > 0) return;

      const towerPos = towerPositions[key];
      const troopsInRange = opponentTroops
        .map((troop) => ({
          troop,
          distance: Math.hypot(
            troop.position.x - towerPos.x,
            troop.position.y - towerPos.y
          ),
        }))
        .filter((item) => item.distance <= this.TOWER_RANGE)
        .sort((a, b) => a.distance - b.distance);

      if (troopsInRange.length > 0) {
        const targetTroop = troopsInRange[0].troop;
        const currentDamage = damages.get(targetTroop.id) || 0;
        damages.set(targetTroop.id, currentDamage + this.TOWER_DAMAGE);

        this.towerAttackCooldowns.update((cds) => {
          const newCds = structuredClone(cds);
          newCds[team][key] = this.TOWER_ATTACK_SPEED;
          return newCds;
        });
      }
    });
  }

  private updateTroops(
    damages: Map<string | number, number>
  ): Troop[] {
    const allTroops = this.activeTroops();
    return allTroops.map((troop) => {
      if (troop.action === 'dying') return troop;

      let newTroop = { ...troop };
      if (newTroop.attackCooldown > 0) newTroop.attackCooldown--;

      this.findOrValidateTarget(newTroop, allTroops);

      if (newTroop.targetId) {
        this.moveOrAttack(newTroop, allTroops, damages);
      } else {
        newTroop.action = 'idle';
      }
      return newTroop;
    });
  }

  private findOrValidateTarget(
    troop: Troop,
    allTroops: Troop[]
  ): void {
    let targetIsValid = false;

    if (troop.targetId !== null) {
      if (typeof troop.targetId === 'number') {
        const targetTroop = allTroops.find(
          (t) => t.id === troop.targetId
        );
        targetIsValid =
          !!targetTroop &&
          targetTroop.hp > 0 &&
          targetTroop.action !== 'dying';
      } else {
        const [team, key] = troop.targetId.split('-') as [
          'player' | 'enemy',
          'king' | 'left' | 'right'
        ];
        targetIsValid = this.towerHP()[team][key] > 0;
      }
    }

    if (targetIsValid) return;

    const targetTeam = troop.team === 'player' ? 'enemy' : 'player';
    const enemyTroops = allTroops.filter(
      (t) => t.team === targetTeam && t.action !== 'dying'
    );

    const potentialTargets = [
      ...enemyTroops.map((t) => ({ id: t.id, position: t.position })),
      ...Object.entries(this.TOWER_POSITIONS[targetTeam])
        .filter(
          ([key]) =>
            this.towerHP()[targetTeam][
              key as 'king' | 'left' | 'right'
            ] > 0
        )
        .map(([key, pos]) => ({
          id: `${targetTeam}-${key}`,
          position: pos,
        })),
    ];

    if (potentialTargets.length > 0) {
      let closest = potentialTargets[0];
      let minDistance = Math.hypot(
        troop.position.x - closest.position.x,
        troop.position.y - closest.position.y
      );

      for (let i = 1; i < potentialTargets.length; i++) {
        const dist = Math.hypot(
          troop.position.x - potentialTargets[i].position.x,
          troop.position.y - potentialTargets[i].position.y
        );
        if (dist < minDistance) {
          minDistance = dist;
          closest = potentialTargets[i];
        }
      }
      troop.targetId = closest.id;
    } else {
      troop.targetId = null;
    }
  }

  private moveOrAttack(
    troop: Troop,
    allTroops: Troop[],
    damages: Map<string | number, number>
  ): void {
    let targetPos: Position;

    if (typeof troop.targetId === 'number') {
      targetPos = allTroops.find(
        (t) => t.id === troop.targetId
      )!.position;
    } else {
      const [team, key] = troop.targetId!.split('-') as [
        'player' | 'enemy',
        'king' | 'left' | 'right'
      ];
      targetPos = this.TOWER_POSITIONS[team][key];
    }

    const dx = targetPos.x - troop.position.x;
    const dy = targetPos.y - troop.position.y;
    const distance = Math.hypot(dx, dy);

    const range = troop.card.range || 50;
    const attackDurationFrames = 5;
    const maxCooldown = (troop.card.attackSpeed || 1) * 30;

    if (distance <= range) {
      if (troop.attackCooldown <= 0) {
        const currentDamage =
          damages.get(troop.targetId!) || 0;
        damages.set(
          troop.targetId!,
          currentDamage + (troop.card.damage || 0)
        );
        troop.attackCooldown = maxCooldown;
      }
    } else {
      const speed = troop.card.speed || 2;
      troop.position = {
        x: troop.position.x + (dx / distance) * speed,
        y: troop.position.y + (dy / distance) * speed,
      };
    }

    if (troop.attackCooldown >= maxCooldown - attackDurationFrames) {
      troop.action = 'attacking';
    } else if (distance > range) {
      troop.action = 'moving';
    } else {
      troop.action = 'idle';
    }
  }

  private applyDamagesAndHandleDeaths(
    troops: Troop[],
    damages: Map<string | number, number>
  ): void {
    damages.forEach((damage, targetId) => {
      if (typeof targetId === 'string') {
        const [team, key] = targetId.split('-') as [
          'player' | 'enemy',
          'king' | 'left' | 'right'
        ];
        this.dealDamageToTower(team, key, damage);
      }
    });

    const deathAnimationFrames = 20;

    const troopsAfterStateUpdate = troops.map((t) => {
      const damage = damages.get(t.id);
      const newHp = damage ? Math.max(0, t.hp - damage) : t.hp;

      if (newHp <= 0 && t.action !== 'dying') {
        return {
          ...t,
          hp: 0,
          action: 'dying' as const,
          deathCooldown: deathAnimationFrames,
        };
      }

      if (t.action === 'dying') {
        return {
          ...t,
          deathCooldown: (t.deathCooldown || 0) - 1,
        };
      }

      return { ...t, hp: newHp };
    });

    this.activeTroops.set(
      troopsAfterStateUpdate.filter(
        (t) => t.action !== 'dying' || (t.deathCooldown || 0) > 0
      )
    );
  }

  private checkGameEndConditions(): void {
    if (this.towerHP().enemy.king <= 0) {
      this.gameStatus.set('win');
      clearInterval(this.gameLoop);
      clearInterval(this.elixirInterval);
    } else if (this.towerHP().player.king <= 0) {
      this.gameStatus.set('lose');
      clearInterval(this.gameLoop);
      clearInterval(this.elixirInterval);
    }
  }

  dealDamageToTower(
    team: 'player' | 'enemy',
    target: 'left' | 'right' | 'king',
    damage: number
  ): void {
    this.towerHP.update((hp) => {
      const newHpState = structuredClone(hp);
      newHpState[team][target] = Math.max(
        0,
        newHpState[team][target] - damage
      );
      return newHpState;
    });

    this.towerFlashing.update((current) => {
      const newFlashState = structuredClone(current);
      newFlashState[team][target] = true;
      return newFlashState;
    });

    setTimeout(() => {
      this.towerFlashing.update((current) => {
        const newFlashState = structuredClone(current);
        newFlashState[team][target] = false;
        return newFlashState;
      });
    }, 300);
  }
}
