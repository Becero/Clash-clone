import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ArenaComponent } from './components/arena/arena.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';
import { CardService } from './services/card.service';
import { UserService } from './services/user.service';
import { Card } from './models/card.model';
import { ClassicChallengeComponent } from './components/classic-challenge/classic-challenge.component';
import { GuildHubComponent } from './components/guild-hub/guild-hub.component';
import { GuildViewComponent } from './components/guild-view/guild-view.component';

interface TrophyReward {
  trophiesRequired: number;
  reward: {
    type: 'gold' | 'chest';
    name: string;
    imageUrl: string;
    amount?: number;
  };
}

const DECK_STORAGE_KEY = 'rpg-deck-builder-decks-v1'; // PERSISTÊNCIA

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent,
    ArenaComponent,
    CardDetailComponent,
    ClassicChallengeComponent,
    GuildHubComponent,
    GuildViewComponent
  ],
})
export class AppComponent {
  private cardService = inject(CardService);
  private userService = inject(UserService);

  readonly DECK_SIZE = 8;
  readonly RARITY_ORDER: Card['rarity'][] = ['Divino', 'Heroico', 'Comum'];

  readonly trophyRoad: TrophyReward[] = [
    {
      trophiesRequired: 0,
      reward: {
        type: 'chest',
        name: 'Início',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/icons/trophy.png',
      },
    },
    {
      trophiesRequired: 500,
      reward: {
        type: 'gold',
        name: 'Ouro',
        amount: 500,
        imageUrl:
          'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/icons/gold_pile.png',
      },
    },
    {
      trophiesRequired: 1000,
      reward: {
        type: 'chest',
        name: 'Baú de Prata',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/chests/chest_silver.png',
      },
    },
    {
      trophiesRequired: 1500,
      reward: {
        type: 'gold',
        name: 'Ouro',
        amount: 1000,
        imageUrl:
          'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/icons/gold_pile.png',
      },
    },
    {
      trophiesRequired: 2000,
      reward: {
        type: 'chest',
        name: 'Baú de Ouro',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/chests/chest_gold.png',
      },
    },
    {
      trophiesRequired: 2500,
      reward: {
        type: 'chest',
        name: 'Baú Mágico',
        imageUrl:
          'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/chests/chest_magic.png',
      },
    },
  ];

  // App State
  allCards = signal<Card[]>([]);
  showArena = signal(false);
  selectedCardForDetail = signal<Card | null>(null);
  currentView = signal<'main' | 'collection' | 'guild'>('main');
  showClassicChallenge = signal(false);

  // User & Deck
  user = this.userService.user;
  decks = signal<(Card | null)[][]>([
    Array(this.DECK_SIZE).fill(null),
    Array(this.DECK_SIZE).fill(null),
    Array(this.DECK_SIZE).fill(null),
  ]);
  selectedDeckIndex = signal(0);

  currentDeck = computed(() => this.decks()[this.selectedDeckIndex()]);

  groupedCards = computed(() => {
    const grouped: { [key in Card['rarity']]?: Card[] } = {};
    this.allCards().forEach(card => {
      if (!grouped[card.rarity]) {
        grouped[card.rarity] = [];
      }
      grouped[card.rarity]!.push(card);
    });

    return this.RARITY_ORDER
      .filter(rarity => grouped[rarity])
      .map(rarity => ({ rarity, cards: grouped[rarity]! }));
  });

  averageElixir = computed(() => {
    const cardsInDeck = this.currentDeck().filter(
      (card): card is Card => card !== null,
    );
    if (cardsInDeck.length === 0) return '0.0';
    const totalElixir = cardsInDeck.reduce(
      (sum, card) => sum + card.elixirCost,
      0,
    );
    return (totalElixir / cardsInDeck.length).toFixed(1);
  });

  isDeckFull = computed(() => this.currentDeck().every(card => card !== null));

  previousTrophyReward = computed(() => {
    const userTrophies = this.user().trophies;
    return (
      [...this.trophyRoad]
        .reverse()
        .find(r => userTrophies >= r.trophiesRequired) ?? null
    );
  });

  nextTrophyReward = computed(() => {
    const userTrophies = this.user().trophies;
    return (
      this.trophyRoad.find(r => userTrophies < r.trophiesRequired) ?? null
    );
  });

  trophyProgressPercent = computed(() => {
    const currentTrophies = this.user().trophies;
    const prevReward = this.previousTrophyReward();
    const nextReward = this.nextTrophyReward();

    if (!nextReward) return 100;

    const prevTrophies = prevReward?.trophiesRequired ?? 0;
    const nextTrophies = nextReward.trophiesRequired;
    const range = nextTrophies - prevTrophies;
    const progress = currentTrophies - prevTrophies;

    return Math.max(0, Math.min(100, (progress / range) * 100));
  });

  constructor() {
    // 1) Carregar todas as cartas (fixas) do serviço
    const all = this.cardService.getAllCards(); // usa o método novo
    this.allCards.set([...all]);

    // 2) Tentar carregar decks do localStorage  ----------------- PERSISTÊNCIA
    try {
      const saved = localStorage.getItem(DECK_STORAGE_KEY);
      if (saved) {
        const parsed: (string | null)[][] = JSON.parse(saved);

        const idToCard = new Map(all.map(c => [c.id, c]));
        const rebuiltDecks: (Card | null)[][] = parsed.map(deck =>
          deck.map(id => (id ? idToCard.get(id) ?? null : null)),
        );

        if (rebuiltDecks.length > 0) {
          this.decks.set(rebuiltDecks);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar decks do localStorage', e);
    }

    // 3) Sempre que os decks mudarem, salvar no localStorage ----- PERSISTÊNCIA
    effect(() => {
      const decksValue = this.decks();

      const idsDecks: (string | null)[][] = decksValue.map(deck =>
        deck.map(card => (card ? card.id : null)),
      );

      try {
        localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(idsDecks));
      } catch (e) {
        console.error('Erro ao salvar decks no localStorage', e);
      }
    });
  }

  // Helpers
  isCardInDeck(card: Card): boolean {
    return this.currentDeck().some(c => c?.id === card.id);
  }

  // Views / modal
  openCardDetail(card: Card): void {
    this.selectedCardForDetail.set(card);
  }

  closeCardDetail(): void {
    this.selectedCardForDetail.set(null);
  }

  selectDeck(index: number): void {
    this.selectedDeckIndex.set(index);
  }

  confirmAddToDeck(newCard: Card): void {
    if (this.isCardInDeck(newCard)) {
      this.closeCardDetail();
      return;
    }

    const emptySlotIndex = this.currentDeck().indexOf(null);
    if (emptySlotIndex !== -1) {
      this.decks.update(currentDecks => {
        const newDecks = [...currentDecks];
        const deckToUpdate = [...newDecks[this.selectedDeckIndex()]];
        deckToUpdate[emptySlotIndex] = newCard;
        newDecks[this.selectedDeckIndex()] = deckToUpdate;
        return newDecks;
      });
    }
    this.closeCardDetail();
  }

  removeCardFromDeck(index: number): void {
    this.decks.update(currentDecks => {
      const newDecks = [...currentDecks];
      const deckToUpdate = [...newDecks[this.selectedDeckIndex()]];
      deckToUpdate[index] = null;
      newDecks[this.selectedDeckIndex()] = deckToUpdate;
      return newDecks;
    });
  }

  // Arena
  enterArena(): void {
    if (this.isDeckFull()) {
      this.showArena.set(true);
    }
  }

  exitArena(): void {
    this.showArena.set(false);
  }

  // Classic Challenge
  openClassicChallenge(): void {
    this.showClassicChallenge.set(true);
  }

  closeClassicChallenge(): void {
    this.showClassicChallenge.set(false);
  }
}
